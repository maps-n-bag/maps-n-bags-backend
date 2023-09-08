const models = require('../db/models');
const MAX_ACTIVITY_PER_DAY = 3;



module.exports.getUpdatePlan = async (req, res) => {
    try {
        const plan_id = parseInt(req.query.plan_id);
        const body = req.body;
        const { add, remove } = body;
        const plan = await models.Plan.findByPk(plan_id);


        // Check if plan exists
        if (!plan) {
            return res.status(404).send('Plan not found');
        }

        // Update PlanRegion table if regions are added
        let otherRegions = req.body.regions;
        if (otherRegions && otherRegions.length > 0) {
            for (let i = 0; i < otherRegions.length; i++) {
                let region = await models.Region.findOne({
                    where: {
                        id: otherRegions[i]
                    }
                })
                if (region) {
                    await models.PlanRegion.create({
                        plan_id: plan_id,
                        region_id: otherRegions[i]
                    })
                }
            }
        }

        // Remove events from plan
        if (remove) {
            for (let i = 0; i < remove.length; i++) {
                let activity = await models.Event.findOne({
                    where: {
                        place_id: remove[i].place_id,
                        plan_id: plan_id,
                        activity_id: remove[i].activity_id
                    }
                })
                if (activity) {
                    await activity.destroy();
                }
            }
        }

        // Add events to plan with the already existing events
        const all_events = await models.Event.findAll({
            where: {
                plan_id: plan_id
            }
        });
        let placeActivities = all_events.map(event => {
            return {
                event_id: event.id,
                place_id: event.place_id,
                activity_id: event.activity_id
            }
        });
        if (add) {
            for (let i = 0; i < add.length; i++) {
                let placeActivity = await models.PlaceActivity.findOne({
                    where: {
                        place_id: add[i].place_id,
                        activity_id: add[i].activity_id
                    }
                })
                if (placeActivity) {
                    let bool_temp = false;
                    for (let j = 0; j < placeActivities.length; j++) {
                        if (placeActivities[j].place_id === add[i].place_id && placeActivities[j].activity_id === add[i].activity_id) {
                            bool_temp = true;
                            break;
                        }
                    }
                    if (!bool_temp) {
                        const event = await models.Event.create({
                            plan_id: plan_id,
                            place_id: add[i].place_id,
                            activity_id: add[i].activity_id,
                            day: 1,
                            start_time: new Date(plan.start_date),
                            end_time: new Date(plan.start_date)
                        });
                        placeActivities.push({
                            event_id: event.id,
                            place_id: event.place_id,
                            activity_id: event.activity_id
                        });
                    }
                }
            }
        }


        // Check if the plan is valid
        if (placeActivities.length == 0) {
            res.status(404).send('No activity found');
            return;
        }

        console.log(placeActivities.length);

        // setup the necessary variables
        let number_of_days = Math.ceil(placeActivities.length / MAX_ACTIVITY_PER_DAY)
        const start_date = new Date(plan.start_date);
        const end_date = new Date(plan.start_date);

        // update the plan with the new number of days
        const prevNumberOfDays = (plan.end_date - plan.start_date) / (1000 * 60 * 60 * 24) + 1;
        console.log('prevNumberOfDays: ', prevNumberOfDays, ' number_of_days: ', number_of_days);
        if (prevNumberOfDays != number_of_days) {
            end_date.setDate(end_date.getDate() + number_of_days - 1);
            plan.end_date = end_date;
            await plan.save();
        }



        // Get all the regions of the plan
        let regions = await models.PlanRegion.findAll({
            where: {
                plan_id: plan_id
            },
            attributes: ['region_id']
        });
        regions = regions.map((region) => {
            return region.dataValues.region_id;
        });


        // Get all the regions of the plan for the starting region
        let placeRegion = await models.Region.findAll({
            where: {
                id: regions
            },
            attributes: ['representative_place_id']
        });
        placeRegion = placeRegion.map((place) => {
            return place.dataValues.representative_place_id;
        });
        let allPlaces = placeActivities.map((placeActivity) => {
            return placeActivity.place_id;
        });


        // all places set
        allPlaces = [...new Set(allPlaces)];
        allPlaces.push(...placeRegion);


        // Get all the distances between the places
        let distances = await models.Distance.findAll({
            where: {
                first_place_id: allPlaces,
                second_place_id: allPlaces
            },
            attributes: ['first_place_id', 'second_place_id', 'distance', 'est_time']
        });
        distances = distances.map((distance) => {
            return distance.dataValues;
        });



        // create the minimum distance places serially
        let firstPlaceID;
        let regionTofirstPlaceDistance = distances.filter((distance) => {
            return (placeRegion.includes(distance.first_place_id) || placeRegion.includes(distance.second_place_id)) &&
                ~(placeRegion.includes(distance.first_place_id) && placeRegion.includes(distance.second_place_id));
        });
        regionTofirstPlaceDistance = regionTofirstPlaceDistance.sort((a, b) => {
            return a.distance - b.distance;
        });
        if (placeRegion.includes(regionTofirstPlaceDistance[0].first_place_id)) {
            firstPlaceID = regionTofirstPlaceDistance[0].second_place_id;
        }
        else {
            firstPlaceID = regionTofirstPlaceDistance[0].first_place_id;
        }
        allPlaces.splice(allPlaces.indexOf(firstPlaceID), 1);
        for (region of regions) {
            allPlaces.splice(allPlaces.indexOf(region), 1);
        }
        let plan_serialized = []
        plan_serialized.push(firstPlaceID);
        let currentPlaceID = firstPlaceID;
        while (allPlaces.length != 0) {
            let nearbyPlaces = await getNearbyPlaces(currentPlaceID, allPlaces, distances);
            plan_serialized.push(nearbyPlaces);
            allPlaces.splice(allPlaces.indexOf(nearbyPlaces), 1);
            currentPlaceID = nearbyPlaces;
        }
        console.log(plan_serialized);



        // update the events with the new plan
        for (let i = 1; i <= number_of_days; i++) {
            if (plan_serialized.length == 0) {
                break;
            }

            // get the number of activities for the current day
            let activity_count = MAX_ACTIVITY_PER_DAY;
            if (i == number_of_days) {
                activity_count = placeActivities.length;
            }


            // get the activities for the current day
            let plan_activity_for_current_day = [];
            while (activity_count > 0 && plan_serialized.length != 0) {
                let place = plan_serialized[0];
                let activity = placeActivities.filter((placeActivity) => {
                    return placeActivity.place_id == place;
                });
                if (activity.length == 0) {
                    plan_serialized.shift()
                    continue;
                }
                else if (activity.length <= activity_count) {
                    activity_count = activity_count - activity.length;
                    plan_serialized.shift();
                    plan_activity_for_current_day.push(...activity);
                }
                else {
                    for (let m = 0; m < activity_count; m++) {
                        plan_activity_for_current_day.push(activity[m]);
                        placeActivities.splice(placeActivities.indexOf(activity[m]), 1);
                    }
                    activity_count = 0;
                }
            }
            console.log(plan_activity_for_current_day);



            // calculate the start time, end time and activity time for each activity
            // calculate the total journey time
            let total_journey_time = 0;
            for (let j = 0; j < plan_activity_for_current_day.length - 1; j++) {
                if (plan_activity_for_current_day[j].place_id == plan_activity_for_current_day[j + 1].place_id) {
                    continue;
                }
                let distance = distances.filter((distance) => {
                    return (distance.first_place_id == plan_activity_for_current_day[j].place_id && distance.second_place_id == plan_activity_for_current_day[j + 1].place_id) ||
                        (distance.first_place_id == plan_activity_for_current_day[j + 1].place_id && distance.second_place_id == plan_activity_for_current_day[j].place_id);
                });
                total_journey_time += distance[0].est_time;
            }



            let start_time = 0;
            if (total_journey_time > 2.5 * 60) {
                start_time = total_journey_time - 2.5 * 60;
            }
            let end_time = 0;
            if (start_time > 1.5 * 60) {
                end_time = start_time - 1.5 * 60;
            }


            // calculate the activity time
            let total_activity_time = start_time + end_time + 8.5 * 60 - total_journey_time;
            let activity_time = total_activity_time / plan_activity_for_current_day.length;
            let currentTimestamp = new Date(start_date);
            currentTimestamp.setDate(currentTimestamp.getDate() + i - 1);
            currentTimestamp.setHours(9, 30, 0, 0);
            console.log(currentTimestamp);
            console.log(start_time);
            console.log(activity_time);
            console.log(total_journey_time);
            currentTimestamp = subtractTime(currentTimestamp, Math.floor(start_time / 60), start_time % 60, 0, 0);


            // update the events
            for (let j = 0; j < plan_activity_for_current_day.length; j++) {


                // update the event
                let activity = await models.Event.findByPk(plan_activity_for_current_day[j].event_id);
                activity.day = i;
                activity.start_time = currentTimestamp;
                activity.end_time = addTime(currentTimestamp, Math.floor(activity_time / 60), activity_time % 60, 0, 0);
                await activity.save();


                // update the current timestamp
                currentTimestamp = addTime(currentTimestamp, Math.floor(activity_time / 60), activity_time % 60, 0, 0);
                if (j != plan_activity_for_current_day.length - 1 && plan_activity_for_current_day[j].place_id != plan_activity_for_current_day[j + 1].place_id) {
                    let distance = distances.filter((distance) => {
                        return (distance.first_place_id == plan_activity_for_current_day[j].place_id && distance.second_place_id == plan_activity_for_current_day[j + 1].place_id) ||
                            (distance.first_place_id == plan_activity_for_current_day[j + 1].place_id && distance.second_place_id == plan_activity_for_current_day[j].place_id);
                    });
                }
            }
        }
        return plan;

    }
    catch (e) {
        console.log('Plan post error: ', e);
        return res.status(400).send('Bad request');
    }
}

const subtractTime = (timestamp, hours, minutes, seconds, milliseconds) => {
    timestamp.setHours(timestamp.getHours() - hours);
    const totalMinutes = timestamp.getMinutes() - minutes;
    if (totalMinutes < 0) {
        timestamp.setHours(timestamp.getHours() - 1);
        timestamp.setMinutes(60 + totalMinutes);
    }
    else {
        timestamp.setMinutes(totalMinutes);
    }
    return timestamp;
}
const addTime = (timestamp, hours, minutes, seconds, milliseconds) => {
    timestamp.setHours(timestamp.getHours() + hours);
    const totalMinutes = timestamp.getMinutes() + minutes;
    if (totalMinutes > 60) {
        timestamp.setHours(timestamp.getHours() + 1);
        timestamp.setMinutes(totalMinutes - 60);
    }
    else {
        timestamp.setMinutes(totalMinutes);
    }
    return timestamp;
}

const getNearbyPlaces = async (fromPLaceId, allPlaces, distances) => {
    let nearbyPlaces = distances.filter((distance) => {
        return distance.first_place_id == fromPLaceId || distance.second_place_id == fromPLaceId;
    });
    nearbyPlaces = nearbyPlaces.sort((a, b) => {
        return a.distance - b.distance;
    });
    nearbyPlaces = nearbyPlaces.map((place) => {
        if (place.first_place_id == fromPLaceId) {
            return place.second_place_id;
        }
        else {
            return place.first_place_id;
        }
    });
    nearbyPlaces = nearbyPlaces.filter((place) => {
        return allPlaces.includes(place);
    });
    return nearbyPlaces[0];
}