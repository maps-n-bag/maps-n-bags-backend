const { Op } = require("sequelize");
const models = require('../db/models');

module.exports = {

  getEvents:
    async (req, res) => {

      try {
        const plan_id = req.query.plan_id;
        const day = req.query.day;

        try {
          const plan = await models.Plan.findByPk(plan_id);
          if (!plan) {
            res.status(404).send('Plan not found');
            return;
          }

          const start_date = plan.start_date;
          const end_date = plan.end_date;
          const noOfDays = (end_date - start_date) / (1000 * 60 * 60 * 24) + 1;
          console.log('noOfDays: ', noOfDays);

          let result = null;
          if (day) {
            result = await calculateEventsList(res, plan_id, noOfDays, day);
          } else {
            result = [];
            for (let i = 1; i <= noOfDays; i++) {
              const eventsList = await calculateEventsList(res, plan_id, noOfDays, i);
              result.push(eventsList);
            }
          }

          res.status(200).send(result);

        } catch (e) {
          console.log('Events get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Events get error: ', e);
        res.status(400).send('Bad request');
      }
    },

  getEventDetail:
    async (req, res) => {

      try {
        const event_id = req.query.event_id;

        try {
          let eventDetail = await models.EventDetail.findOne({
            where: {
              event_id: event_id
            }
          });

          if (!eventDetail) {
            // we have to create one
            eventDetail = await models.EventDetail.create({
              event_id: event_id,
              checked: false,
              note: '',
              generated_details: '',
              expenditure: 0
            });

            res.status(201).send({
              ...eventDetail.dataValues,
              images: []
            })
            return;
          }

          const eventImages = await models.EventImage.findAll({
            where: {
              event_id: event_id
            }
          });

          const result = { ...eventDetail.dataValues, images: eventImages.map(image => image.link) };

          res.status(200).send(result);

        } catch (e) {
          console.log('Event get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Event get error: ', e);
        res.status(400).send('Bad request');
      }

    },

  updateEventDetail:
    async (req, res) => {

      try {
        console.log('updateEventDetail: ', req.body);
        console.log('updateEventDetail: ', req.query);
        const event_id = req.query.event_id;
        const { checked, note, generated_details, expenditure, images } = req.body;

        try {
          const eventDetail = await models.EventDetail.findOne({
            where: {
              event_id: event_id
            }
          });

          if (!eventDetail) {
            // create one
            await models.EventDetail.create({
              event_id: event_id,
              checked,
              note,
              generated_details,
              expenditure
            });
          }
          else {
            // update one
            await eventDetail.update({
              checked,
              note,
              generated_details,
              expenditure
            });
          }

          const eventImages = await models.EventImage.findAll({
            where: {
              event_id: event_id
            }
          });

          if (eventImages) {
            for (let i = 0; i < eventImages.length; i++) {
              const image = eventImages[i];
              await image.destroy();
            }
          }

          if (images) {
            for (let i = 0; i < images.length; i++) {
              const image = images[i];
              await models.EventImage.create({
                event_id: event_id,
                link: image
              });
            }
          }

          res.status(200).send(eventDetail);

        } catch (e) {
          console.log('Event update error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Event update error: ', e);
        res.status(400).send('Bad request');
      }

    },
  getGenerateBlog: async (req, res) => {
    try {
      const plan_id = req.query.plan_id;
      const plan = await models.Plan.findOne({
        where: {
          id: plan_id
        }
      });
      if (!plan) {
        res.status(404).send('plan not found');
        return;
      }
      const start_date = plan.start_date;
      const end_date = plan.end_date;
      const noOfDays = (end_date - start_date) / (1000 * 60 * 60 * 24) + 1;
      console.log('noOfDays: ', noOfDays);

      let result = null;
      result = [];
      for (let i = 1; i <= noOfDays; i++) {
        const eventsList = await calculateEventsListForBlog( plan_id, noOfDays, i);
        result.push({
          day: i,
          events:eventsList});
      }
      let blog={
        plan_id:plan_id,
        plan_title:plan.title,
        plan_description:plan.description,
        plan_start_date:plan.start_date,
        plan_end_date:plan.end_date,
        dayWiseEvents:result
      }
      res.status(200).send(blog);
    } catch (e) {
      console.log('Event get error: ', e);
      res.status(500).send('Internal server error');
    }
  },
  getSuggestion: async (req, res) => {
    try{
        console.log('getSuggestion: ', req.query);
        const plan_id = req.query.plan_id;
        const event_id = req.query.event_id;
        if(!plan_id || !event_id){
          res.status(400).send('Bad request');
          return;
        }
        const plan = await models.Plan.findOne({
          where: {
            id: plan_id
          }
        });
        if (!plan) {
          res.status(404).send('plan not found');
          return;
        }
        let all_events = await models.Event.findAll({
          where: {
            plan_id: plan_id
          }
        });
        all_events = all_events.map(event => event.dataValues);
        let current_event = all_events.find(event => event.id == event_id);
        if(!current_event){
          res.status(404).send('event not found');
          return;
        }
        let current_event_place = current_event.place_id;
        

        let allActivityInPlace= await models.PlaceActivity.findAll({
          where:{
            place_id:current_event_place
          },
          unique:true,
          attributes:['activity_id'],
          group:['activity_id']
        });

        allActivityInPlace=allActivityInPlace.map(placeActivity=>placeActivity.dataValues);


        let allActivityNotInPlan=[];
        for(let i=0;i<allActivityInPlace.length;i++){

          let activity_id=allActivityInPlace[i].activity_id;

          if(!all_events.find(event=>event.activity_id==activity_id && event.place_id==current_event_place)){
            const activity= await models.Activity.findByPk(activity_id);
            allActivityNotInPlan.push(activity.dataValues);
          }
        }

        let nearestTenPlace= await models.Distance.findAll({
          where:{
            [Op.or]:[
              {
                first_place_id:current_event_place
              },
              {
                second_place_id:current_event_place
              }
            ]
          },
          order:[
            ['distance','ASC']
          ],
          limit:10
        });


        nearestTenPlace=nearestTenPlace.map(distance=>{
          if(distance.first_place_id==current_event_place){
            return distance.second_place_id;
          }
          else{
            return distance.first_place_id;
          }
        });

        let suggestionPlace;

        for(let i=0;i<nearestTenPlace.length;i++){
          let activities= await models.PlaceActivity.findAll({
            where:{
              place_id:nearestTenPlace[i]
            },
            unique:true,
            attributes:['activity_id'],
            group:['activity_id']
          });

          activities=activities.map(activity=>activity.dataValues);

          let activityNotInPlan=[];
          for(let j=0;j<activities.length;j++){
            let activity_id=activities[j].activity_id;
            
            if(!all_events.find(event=>event.activity_id==activity_id && event.place_id==nearestTenPlace[i])){
              const activity= await models.Activity.findByPk(activity_id);
              activityNotInPlan.push(activity.dataValues);
            }
          }
          if(activityNotInPlan.length>0){
            let place= await models.Place.findByPk(nearestTenPlace[i]);
            suggestionPlace={
              place:place.dataValues,
              activity:activityNotInPlan
            };
            break;
          }
        }
        let suggestion={
          activity:allActivityNotInPlan,
          place:suggestionPlace
        }
        res.status(200).send(suggestion);
    }
    catch(e){
      console.log('Event get error: ', e);
      res.status(500).send('Internal server error');
    }
  }
}


async function calculateEventsList(res, plan_id, noOfDays, day) {

  const activities = await models.Activity.findAll({
    order: [['id', 'ASC']]
  });

  const currentDayEvents = await models.Event.findAll({
    where: {
      plan_id: plan_id,
      day: day
    },
    order: [
      ['start_time', 'ASC']
    ]
  });

  if (!currentDayEvents) {
    res.status(404).send('Events not found for this day');
    return;
  }

  const result = [];
  let previousEventPlaceId = null;

  // for the first day, the journey is from first event's region's center to the first event
  if (day == 1) {
    const firstEvent = currentDayEvents[0];
    const firstEventPlaceId = firstEvent.place_id;
    const firstEventPlace = await models.Place.findByPk(firstEventPlaceId);
    const firstEventRegionId = firstEventPlace.region_id;
    const firstEventRegion = await models.Region.findByPk(firstEventRegionId);
    previousEventPlaceId = firstEventRegion.representative_place_id;
  }
  // for all the other days and events, the journey is from the previous event to the current event
  else {
    const previousDayEvents = await models.Event.findAll({
      where: {
        plan_id: plan_id,
        day: day - 1
      },
      order: [
        ['start_time', 'ASC']
      ]
    });
    const lastEventOfPreviousDay = previousDayEvents[previousDayEvents.length - 1];
    previousEventPlaceId = lastEventOfPreviousDay.place_id;
  }

  // for all the days, the journey is from the previous event to the current event
  for (let i = 0; i < currentDayEvents.length; i++) {
    const currentEvent = currentDayEvents[i];
    const currentEventPlaceId = currentEvent.place_id;
    const journey = await models.Distance.findOne({
      where: {
        [Op.or]: [
          {
            first_place_id: previousEventPlaceId,
            second_place_id: currentEventPlaceId
          },
          {
            first_place_id: currentEventPlaceId,
            second_place_id: previousEventPlaceId
          }
        ]
      },
      attributes: ['journey_type', 'distance', 'est_time']
    });
    modifiedJourney = null;
    if (journey) {
      const previousEventPlace = await models.Place.findByPk(previousEventPlaceId);
      const currentEventPlace = await models.Place.findByPk(currentEventPlaceId);
      modifiedJourney = {
        journey_type: journey.journey_type,
        distance: journey.distance,
        est_time: journey.est_time,
        from: previousEventPlace.title,
        to: currentEventPlace.title
      }
    }
    result.push({
      journey: modifiedJourney,
      event: {
        id: currentEvent.id,
        plan_id: currentEvent.plan_id,
        start_time: currentEvent.start_time,
        end_time: currentEvent.end_time,
        place_id: currentEvent.place_id,
        activity: activities[currentEvent.activity_id - 1].title,
      }
    });

    previousEventPlaceId = currentEventPlaceId;
  }

  // for the last day, the journey is from the last event to the last event's region's center
  if (day == noOfDays) {
    const lastEvent = currentDayEvents[currentDayEvents.length - 1];
    const lastEventPlaceId = lastEvent.place_id;
    const lastEventPlace = await models.Place.findByPk(lastEventPlaceId);
    const lastEventRegionId = lastEventPlace.region_id;
    const lastEventRegion = await models.Region.findByPk(lastEventRegionId);
    const lastEventRegionCenterId = lastEventRegion.representative_place_id;
    let journey = await models.Distance.findOne({
      where: {
        [Op.or]: [
          {
            first_place_id: lastEventPlaceId,
            second_place_id: lastEventRegionCenterId
          },
          {
            first_place_id: lastEventRegionCenterId,
            second_place_id: lastEventPlaceId
          }
        ]
      },
      attributes: ['journey_type', 'distance', 'est_time']
    });

    journey = { ...journey.dataValues, from: lastEventPlace.title, to: lastEventRegion.title }

    result.push({
      journey: journey,
      event: null
    });
  }

  return result;
}
