const models = require('../db/models');
module.exports.createPlan = async(body)=>{
    let number_of_days;
    let regions;
    if(body.start_date && body.end_date && body.regions){
        const start_date = new Date(body.start_date);
        const end_date = new Date(body.end_date);
        number_of_days = (end_date-start_date)/(1000*60*60*24)+1;
        regions = body.regions;
    }
    else{
        return 0;
    }
    let tags;
    let is_tag_provided = false;
    if(body.tags.length>0){
        tags = body.tags;
        is_tag_provided = true;
    }
    console.log(is_tag_provided);
    const placeActivities= await Promise.resolve( is_tag_provided?await findMatchingPlaceActivitiesUserPreference({
        number_of_event:number_of_days*3,
        regions:regions,
        tags:tags
    }):await findMatchingPlaceActivitiesDefault({
        number_of_event:number_of_days*3,
        regions:regions
    }));
    
}
const findMatchingPlaceActivitiesUserPreference = async(props)=>{

}
const findMatchingPlaceActivitiesDefault = async(props)=>{
    const tags = await models.Tag.findAll({
        order: [
            ['id', 'ASC'],
        ],
    });
    let totalPlaces = props.number_of_event;
    let totalPlacesActivityArray = [];
    let interestedPlaces = await models.Place.findAll({
        where:{
            region_id:props.regions
        },
        attributes: ['id'],
        order: [
            ['rating_count', 'DESC']
        ]
    });
    interestedPlaces=interestedPlaces.map((place)=>{
        return place.dataValues.id;
    });
    for(let i=0;i<tags.length && totalPlaces!=0;i++){
        const placeActivities = await models.PlaceActivity.findAll({
            where:{
                tag_id:tags[i].id
            },
            attributes: ['place_id','activity_id']
        });
        if(placeActivities.length>0){
            if(placeActivities.length<totalPlaces){
                for(let j=0;j<placeActivities.length;j++){
                    if(interestedPlaces.includes(placeActivities[j].dataValues.place_id)){
                        totalPlacesActivityArray.push(placeActivities[j].dataValues)
                        totalPlaces = totalPlaces-1;
                    }
                }
                
            }
            else{
                for(let j=0;j<interestedPlaces.length && totalPlaces!=0;j++){
                    if(interestedPlaces.includes(placeActivities[j].dataValues.place_id)){
                        totalPlacesActivityArray.push(placeActivities[j].dataValues)
                        totalPlaces = totalPlaces-1;
                    }
                }
            }
        }
        if(totalPlaces==0){
            break;
        }
    }
    return totalPlacesActivityArray;
}
