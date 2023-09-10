const models = require('../db/models');
const MAX_ACTIVITY_PER_DAY = 3;
module.exports.createPlan = async(body)=>{
    let number_of_days;
    let regions;
    if (body.start_date && body.end_date && body.regions) {
        const start_date = new Date(body.start_date);
        const end_date = new Date(body.end_date);
        number_of_days = (end_date - start_date) / (1000 * 60 * 60 * 24) + 1;
        regions = body.regions;
    }
    else {
        return 0;
    }
    let tags;
    let is_tag_provided = false;
    if (body.tags.length > 0) {
        tags = body.tags;
        is_tag_provided = true;
    }
    console.log(is_tag_provided);
    console.log(number_of_days);
    let placeActivities= await Promise.resolve( is_tag_provided?await findMatchingPlaceActivitiesUserPreference({
        number_of_event:number_of_days*MAX_ACTIVITY_PER_DAY,
        regions:regions,
        tags:tags
    }):await findMatchingPlaceActivitiesDefault({
        number_of_event:number_of_days*MAX_ACTIVITY_PER_DAY,
        regions:regions
    }));
    if(placeActivities.length==0){
        return 0;
    }
    console.log(placeActivities);
    console.log(placeActivities.length);
    let placeRegion= await models.Region.findAll({
        where:{
            id:regions
        },
        attributes: ['representative_place_id']
    });
    placeRegion=placeRegion.map((place)=>{
        return place.dataValues.representative_place_id;
    });
    let allPlaces= placeActivities.map((placeActivity)=>{
        return placeActivity.place_id;
    });
    allPlaces = [...new Set(allPlaces)];
    allPlaces.push(...placeRegion);
    let distances= await models.Distance.findAll({
        where:{
           first_place_id:allPlaces,
           second_place_id:allPlaces 
        },
        attributes: ['first_place_id','second_place_id','distance','est_time']
    });
    distances=distances.map((distance)=>{
        return distance.dataValues;
    });
    let firstPlaceID;
    let regionTofirstPlaceDistance=distances.filter((distance)=>{
        return( placeRegion.includes(distance.first_place_id) || placeRegion.includes(distance.second_place_id)) && 
        ~(placeRegion.includes(distance.first_place_id) && placeRegion.includes(distance.second_place_id));
    });
    regionTofirstPlaceDistance=regionTofirstPlaceDistance.sort((a,b)=>{
        return a.distance-b.distance;
    });
    if(placeRegion.includes(regionTofirstPlaceDistance[0].first_place_id)){
        firstPlaceID = regionTofirstPlaceDistance[0].second_place_id;
    }
    else{
        firstPlaceID = regionTofirstPlaceDistance[0].first_place_id;
    }
    allPlaces.splice(allPlaces.indexOf(firstPlaceID),1);
    for(region of regions){
        allPlaces.splice(allPlaces.indexOf(region),1);
    }
    let plan_serialized = []
    plan_serialized.push(firstPlaceID);
    let currentPlaceID = firstPlaceID;
    while (allPlaces.length!=0){
        let nearbyPlaces = await getNearbyPlaces(currentPlaceID, allPlaces, distances);
        plan_serialized.push(nearbyPlaces);
        allPlaces.splice(allPlaces.indexOf(nearbyPlaces),1);
        currentPlaceID = nearbyPlaces;
    }
    console.log(plan_serialized);


    let representative_place_id_of_regions = await models.Region.findAll({
        where: {
            id: regions
        },
        attributes: ['representative_place_id']
    });

    representative_place_id_of_regions = representative_place_id_of_regions.map((place) => {
        return place.dataValues.representative_place_id;
    });

    let plan_image=await models.PlaceImage.findAll({
        where:{
            place_id:representative_place_id_of_regions
        },
        attributes: ['link']
    });
    if(plan_image.length==0){
        plan_image=await models.PlaceImage.findAll({
            where:{
                place_id:plan_serialized
            },
            attributes: ['link']
        });
    }
    plan_image=plan_image.map((image)=>{
        return image.dataValues.link;
    });
    plan_image=plan_image[0];
    let plan_title = await models.Region.findAll({
        where:{
            id:regions
        },
        attributes: ['title']
    });
    plan_title=plan_title.map((title)=>{
        return title.dataValues.title;
    });
    plan_title=plan_title.join(' ')+' '+number_of_days+' Days tour';

    let plan = await models.Plan.create({
        title:plan_title,
        start_date:body.start_date,
        end_date:body.end_date,
        description:'',
        public:false,
        image:plan_image,
        user_id:body.user_id
    });
    for(let i=0;i<regions.length;i++){
        await models.PlanRegion.create({
            plan_id:plan.id,
            region_id:regions[i]
        });
    }
    for(let i=1;i<=number_of_days;i++){
        if(plan_serialized.length==0){
            break;
        }
        let activity_count = MAX_ACTIVITY_PER_DAY;
        let plan_activity_for_current_day = [];
        while(activity_count>0 && plan_serialized.length!=0){
            let place=plan_serialized[0];
            let activity=placeActivities.filter((placeActivity)=>{
                return placeActivity.place_id==place;
            });
            if(activity.length==0){
                plan_serialized.shift()
                continue;
            }
            else if(activity.length<=activity_count){
                activity_count = activity_count-activity.length;
                plan_serialized.shift();
                plan_activity_for_current_day.push(...activity);
            }
            else{
                for(let m=0;m<activity_count;m++){
                    plan_activity_for_current_day.push(activity[m]);
                    placeActivities.splice(placeActivities.indexOf(activity[m]),1);
                }
                activity_count = 0;
            }
        }
        console.log(plan_activity_for_current_day);
        let total_journey_time = 0;
        for(let j=0;j<plan_activity_for_current_day.length-1;j++){
            if(plan_activity_for_current_day[j].place_id==plan_activity_for_current_day[j+1].place_id){
                continue;
            }
            let distance = distances.filter((distance)=>{
                return (distance.first_place_id==plan_activity_for_current_day[j].place_id && distance.second_place_id==plan_activity_for_current_day[j+1].place_id) ||
                (distance.first_place_id==plan_activity_for_current_day[j+1].place_id && distance.second_place_id==plan_activity_for_current_day[j].place_id);
            });
            total_journey_time+=distance[0].est_time;
        }
        let start_time =0;
        if(total_journey_time>2.5*60){
            start_time=total_journey_time-2.5*60;
        }

        let end_time = 0;
        if(start_time>1.5*60){
            end_time = start_time-1.5*60;
        }
        let total_activity_time = start_time+end_time+8.5*60-total_journey_time;
        let activity_time = total_activity_time/plan_activity_for_current_day.length;
        let currentTimestamp = new Date(body.start_date);
        currentTimestamp.setDate(currentTimestamp.getDate()+i-1);
        currentTimestamp.setHours(9,30,0,0);
        console.log(currentTimestamp);
        console.log(start_time);
        console.log(activity_time);
        console.log(total_journey_time);
        currentTimestamp = subtractTime(currentTimestamp,0,start_time,0,0);
        for(let j=0;j<plan_activity_for_current_day.length;j++){
            if(currentTimestamp.getHours()>=17 && currentTimestamp.getMinutes()>=30){
                continue;
            }
            await models.Event.create({
                plan_id:plan.id,
                activity_id:plan_activity_for_current_day[j].activity_id,
                place_id:plan_activity_for_current_day[j].place_id,
                start_time:currentTimestamp,
                day:i,
                end_time: addTime(new Date(currentTimestamp),0,activity_time,0,0)
            });
            currentTimestamp = addTime(currentTimestamp,0,activity_time,0,0);
            if(j!=plan_activity_for_current_day.length-1 && plan_activity_for_current_day[j].place_id!=plan_activity_for_current_day[j+1].place_id){
                let distance = distances.filter((distance)=>{
                    return (distance.first_place_id==plan_activity_for_current_day[j].place_id && distance.second_place_id==plan_activity_for_current_day[j+1].place_id) ||
                    (distance.first_place_id==plan_activity_for_current_day[j+1].place_id && distance.second_place_id==plan_activity_for_current_day[j].place_id);
                });
                currentTimestamp = addTime(currentTimestamp,0,distance[0].est_time,0,0);
            }
            console.log(currentTimestamp);
        }
    }
    return plan.id;
}
const subtractTime = (timestamp, hours, minutes, seconds, milliseconds) => {
    let timeMiliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + milliseconds;
    const temp=new Date(timestamp.getTime() - timeMiliseconds);
    return temp;
}
const addTime = (timestamp, hours, minutes, seconds, milliseconds) => {
    let timeMiliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + milliseconds;
    const temp=new Date(timestamp.getTime() + timeMiliseconds);
    return temp;
}

const getNearbyPlaces = async(fromPLaceId, allPlaces, distances)=>{
    let nearbyPlaces = distances.filter((distance)=>{
        return distance.first_place_id==fromPLaceId || distance.second_place_id==fromPLaceId;
    });
    nearbyPlaces = nearbyPlaces.sort((a,b)=>{
        return a.distance-b.distance;
    });
    nearbyPlaces = nearbyPlaces.map((place)=>{
        if(place.first_place_id==fromPLaceId){
            return place.second_place_id;
        }
        else{
            return place.first_place_id;
        }
    });
    nearbyPlaces = nearbyPlaces.filter((place)=>{
        return allPlaces.includes(place);
    });
    return nearbyPlaces[0];
}

const findMatchingPlaceActivitiesUserPreference = async (props) => {
    const userPreferredTags = props.tags;
    let totalPlaces = props.number_of_event;

    const intPlaces = await models.Place.findAll({
        where: {
            region_id: props.regions
        },
        attributes: ['id'],
        order: [
            ['rating_count', 'DESC']
        ]
    });
    const intPlacesIds = intPlaces.map((place) => { return place.dataValues.id });

    // take the place-activity with the highest number of user preferred tags matched
    let placeActivities = await models.PlaceActivity.findAll({
        where: {
            [models.Sequelize.Op.and]: [
                {
                    place_id: intPlacesIds
                },
                {
                    tag_id: userPreferredTags
                }
            ]
        },
        attributes: ['place_id', 'activity_id', 'tag_id'],
    });
    const placeActivitiesTemp = {};
    for (let i = 0; i < placeActivities.length; i++) {
        const s = placeActivities[i].dataValues.place_id + '-' + placeActivities[i].dataValues.activity_id;
        if (!placeActivitiesTemp[s]) {
            placeActivitiesTemp[s] = 1;
        }
        else {
            placeActivitiesTemp[s] += 1;
        }
    }
    placeActivities = [];
    for (let key in placeActivitiesTemp) {
        placeActivities.push({
            place_id: parseInt(key.split('-')[0]),
            activity_id: parseInt(key.split('-')[1]),
            tag_count: placeActivitiesTemp[key]
        });
    }

    // further sort the place-activities with the descending order of rating
    const placeActivitiesSorted = placeActivities.sort((a, b) => {
        if (a.tag_count != b.tag_count)
            return b.tag_count - a.tag_count;
        else
            return intPlacesIds.indexOf(b.place_id) - intPlacesIds.indexOf(a.place_id);
    });

    let result = [];
    for (let i = 0; i < placeActivitiesSorted.length && totalPlaces > 0; i++) {
        result.push({ place_id: placeActivitiesSorted[i].place_id, activity_id: placeActivitiesSorted[i].activity_id });
        totalPlaces = totalPlaces - 1;
    }

    // if still some slots are left
    // fill them with default tag ordering
    if (totalPlaces > 0) {
        const tagsRanked = await models.Tag.findAll({
            attributes: ['id'], // there would be 'rank' attribute in future
            order: [
                ['id', 'ASC'] // order by rank in future
            ]
        });
        const tagsRankedIds = tagsRanked.map((tag) => { return tag.id });

        let placeActivitiesDefault = await models.PlaceActivity.findAll({
            where: {
                place_id: intPlacesIds
            },
            attributes: ['place_id', 'activity_id', 'tag_id'],
        });
        placeActivitiesDefault = placeActivitiesDefault.map((placeActivity) => {
            return placeActivity.dataValues;
        });

        // sort the place-activities with the descending order of rating
        const placeActivityDefaultSorted = placeActivitiesDefault.sort((a, b) => {
            if (tagsRankedIds.indexOf(a.tag_id) != tagsRankedIds.indexOf(b.tag_id))
                return tagsRankedIds.indexOf(a.tag_id) - tagsRankedIds.indexOf(b.tag_id);
            else
                return intPlacesIds.indexOf(b.place_id) - intPlacesIds.indexOf(a.place_id);
        });

        for (let i = 0; i < placeActivityDefaultSorted.length && totalPlaces > 0; i++) {
            // check if this pair is already in result
            let isAlreadyInResult = false;
            for (let j = 0; j < result.length; j++) {
                if (result[j].place_id == placeActivityDefaultSorted[i].place_id && result[j].activity_id == placeActivityDefaultSorted[i].activity_id) {
                    isAlreadyInResult = true;
                    break;
                }
            }
            if (!isAlreadyInResult) {
                result.push({ place_id: placeActivityDefaultSorted[i].place_id, activity_id: placeActivityDefaultSorted[i].activity_id });
                totalPlaces = totalPlaces - 1;
            }
        }

        // total place should be zero by now
        // otherwise we don't have enough data to create a plan
    }

    console.log(result);
    console.log(result.length)
    return result;
}

const findMatchingPlaceActivitiesDefault = async (props) => {
    let tags = await models.Tag.findAll({
        order: [
            ['id', 'ASC'],
        ],
    });
    tags=tags.map((tag)=>{
        return tag.dataValues.id
    })
    let totalPlaces = props.number_of_event;
    let totalPlacesActivityArray = [];
    let interestedPlaces = await models.Place.findAll({
        where: {
            region_id: props.regions
        },
        attributes: ['id'],
        order: [
            ['rating_count', 'DESC']
        ]
    });
    interestedPlaces = interestedPlaces.map((place) => {
        return place.dataValues.id;
    });
    for (let i = 0; i < tags.length && totalPlaces != 0; i+=2) {
        const placeActivities = await models.PlaceActivity.findAll({
            where: {
                tag_id: tags[i]
            },
            attributes: ['place_id', 'activity_id'],
            order:[
                ['tag_id','ASC']
            ]
        });
        if(placeActivities.length>0){
            if(placeActivities.length<totalPlaces){
                for(let j=0;j<placeActivities.length;j++){
                    if(interestedPlaces.includes(placeActivities[j].dataValues.place_id)){ 
                        let temp_bool = false;
                        for (let k=0;k<totalPlacesActivityArray.length;k++){
                            if(totalPlacesActivityArray[k].place_id==placeActivities[j].dataValues.place_id){
                                temp_bool = true;
                                continue;
                            }
                        }
                        if(temp_bool){
                            continue;
                        }
                        totalPlacesActivityArray.push(placeActivities[j].dataValues)
                        totalPlaces = totalPlaces - 1;
                    }
                }

            }
            else{
                for(let j=0;j<interestedPlaces.length && totalPlaces!=0;j++){
                    let targetpair=[]
                    for(let m=0;m<placeActivities.length;m++){
                        if(interestedPlaces[j]==placeActivities[m].dataValues.place_id){
                            targetpair.push(placeActivities[m].dataValues)
                        }
                    }
                    if(targetpair.length>0){
                        let temp_bool = false;
                        for(let l=0;l<targetpair.length&& totalPlaces!=0;l++){
                            for (let k=0;k<totalPlacesActivityArray.length;k++){
                                if(totalPlacesActivityArray[k].place_id==targetpair[l].place_id && totalPlacesActivityArray[k].activity_id== targetpair[l].activity_id){
                                    temp_bool = true;
                                    continue;
                                }
                            }
                            if(temp_bool){
                                continue;
                            }
                            totalPlacesActivityArray.push(targetpair[l])
                            totalPlaces = totalPlaces -1;
                        }
                    }
                }
            }
        }
        if (totalPlaces == 0) {
            break;
        }
    }
    return totalPlacesActivityArray;
}
