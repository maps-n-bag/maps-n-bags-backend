const models = require('../db/models');
module.exports.createPlan = async (body) => {
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
    const placeActivities = await Promise.resolve(is_tag_provided ? await findMatchingPlaceActivitiesUserPreference({
        number_of_event: number_of_days * 3,
        regions: regions,
        tags: tags
    }) : await findMatchingPlaceActivitiesDefault({
        number_of_event: number_of_days * 3,
        regions: regions
    }));

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
    const tags = await models.Tag.findAll({
        order: [
            ['id', 'ASC'],
        ],
    });
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
    for (let i = 0; i < tags.length && totalPlaces != 0; i++) {
        const placeActivities = await models.PlaceActivity.findAll({
            where: {
                tag_id: tags[i].id
            },
            attributes: ['place_id', 'activity_id']
        });
        if (placeActivities.length > 0) {
            if (placeActivities.length < totalPlaces) {
                for (let j = 0; j < placeActivities.length; j++) {
                    if (interestedPlaces.includes(placeActivities[j].dataValues.place_id)) {
                        totalPlacesActivityArray.push(placeActivities[j].dataValues)
                        totalPlaces = totalPlaces - 1;
                    }
                }

            }
            else {
                for (let j = 0; j < interestedPlaces.length && totalPlaces != 0; j++) {
                    if (interestedPlaces.includes(placeActivities[j].dataValues.place_id)) {
                        totalPlacesActivityArray.push(placeActivities[j].dataValues)
                        totalPlaces = totalPlaces - 1;
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
