const { where } = require('sequelize');
const models = require('../db/models');
const { createPlan } = require('./create.plan')
module.exports = {

  createPlan:
    async (req, res) => {

      try {
        // console.log('req.body: ', req.body);
        const { start_date, end_date, regions, tags } = req.body;

        // from here we will create the plan
        // according to the user's input
        // have to implement the CSP here

        // make the plan
        // write it into database
        // send the plan to the user

        // for now sending the dummy plan
        const plan_id = 1;
        createPlan(req.body)
        const plan = await models.Plan.findByPk(plan_id);

        if (!plan) {
          res.status(404).send('Plan not found');
        }
        else {
          res.status(201).send(plan);
        }

      } catch (e) {
        console.log('Plan post error: ', e);
        res.status(400).send('Bad request');
      }
    },

  getPlan:
    async (req, res) => {

      try {
        const plan_id = req.query.id;

        try {
          const plan = await models.Plan.findByPk(plan_id);

          if (plan) {
            res.status(200).send(plan);
          } else {
            res.status(404).send('Plan not found');
          }

        } catch (e) {
          console.log('Plan get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Plan get error: ', e);
        res.status(400).send('Bad request');
      }
    },

  getExplorations:
    async (req, res) => {

      try {
        const plan_id = req.query.plan_id;

        try {

          // get all the regions in the plan
          const regions = await models.PlanRegion.findAll({
            where: {
              plan_id: plan_id
            }
          });

          if (!regions) {
            res.status(404).send('Plan not found');
            return;
          }

          // get all the places in the regions
          const places = await models.Place.findAll({
            where: {
              region_id: regions.map(region => region.region_id),
              type: 'spot'
            },
            attributes: ['id', 'title', 'rating', 'rating_count']
          });

          if (!places) {
            res.status(404).send('Places in the regions not found');
            return;
          }

          // get all the activities in those places
          const activities = await models.PlaceActivity.findAll({
            where: {
              place_id: places.map(place => place.id)
            }
          });

          if (!activities) {
            res.status(404).send('Activities for the places in the regions in the plan not found');
            return;
          }

          // get all the tags
          const tags = await models.Tag.findAll({
            where: {
              id: activities.map(activity => activity.tag_id)
            }
          });

          if (!tags) {
            res.status(404).send('Tags not found');
            return;
          }

          // get all the images of the places
          const images = await models.PlaceImage.findAll({
            where: {
              place_id: places.map(place => place.id)
            }
          });
          // images can be empty

          // get all the events of the plan to check whether the activity is already in the plan
          const events = await models.Event.findAll({
            where: {
              plan_id: plan_id
            }
          });

          if (!events) {
            res.status(404).send('Events in the plan not found');
            return;
          }

          const tagsPlacesActivities = [];

          for (let i=0; i<tags.length; i++) {
            const tag = tags[i];
            const tag_id = tag.id;

            const tagPlaces = [];
            for (let j=0; j<places.length; j++) {
              const place = places[j];
              const place_id = place.id;

              const placeActivities = [];
              for (let k=0; k<activities.length; k++) {
                const activity = activities[k];

                // check whether the activity is already in the plan
                let in_plan = events.find(event => event.place_id === place_id 
                  && event.activity_id === activity.activity_id) === undefined;

                // only add the activity if it is not in the plan already
                if (!in_plan && activity.tag_id === tag_id && activity.place_id === place_id) {
                  placeActivities.push({
                    id: activity.activity_id,
                    title: activity.activity_title,
                  });
                }
              }

              if (placeActivities.length > 0) {
                tagPlaces.push({
                  id: place_id,
                  title: place.title,
                  rating: place.rating,
                  rating_count: place.rating_count,
                  images: images.filter(image => image.place_id === place_id).map(image => image.link),
                  activities: placeActivities
                });
              }
            }

            if (tagPlaces.length > 0) {
              tagsPlacesActivities.push({
                tag_id: tag_id,
                tag_name: tag.title,
                places: tagPlaces
              });
            }
          }

          res.status(200).send(tagsPlacesActivities);

        } catch (e) {
          console.log('Explorations get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Explorations get error: ', e);
        res.status(400).send('Bad request');
      }

    },

  exploreOtherRegion: async (req, res) => {
    // take those regions that are not in the plan's region but in the plan's region's nearby region
  }
}