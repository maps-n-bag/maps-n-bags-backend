const { where } = require('sequelize');
const models = require('../db/models');
const { createPlan } = require('./create.plan')
const { getUpdatePlan } = require('./update.plan')


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

        const plan_id = await createPlan(req.body)

        if (plan_id == 0) {
          res.status(404).send('Plan not found');
        }
        else {
          const plan = await models.Plan.findByPk(plan_id);
          res.status(201).send(plan);
        }

      } catch (e) {
        console.log('Plan post error: ', e);
        res.status(400).send('Bad request');
      }
    },

  updatePlan:
    async (req, res) => {
      console.log('req.body: ', req.body);
      const plan_id = req.query.plan_id
      if (plan_id) {
        const plan = await getUpdatePlan(req, res)
        res.status(201).send(plan);
      }
      else {
        return res.status(400).send('Bad request');
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

  getAllPlans:
    async (req, res) => {

      try {
        const user_id = req.query.user_id;

        try {
          const plans = await models.Plan.findAll({
            where: {
              user_id: user_id
            }
          });

          if (!plans) {
            return res.status(404).send('Plans not found');
          }

          return res.status(200).send(plans);

        } catch (e) {
          console.log('Plans get error: ', e);
          return res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Plans get error: ', e);
        return res.status(400).send('Bad request');
      }
    },

  deletePlan:
    async (req, res) => {

      try {
        const plan_id = req.query.id;

        try {
          const plan = await models.Plan.findByPk(plan_id);

          if (!plan) {
            return res.status(404).send('Plan not found');
          }

          await plan.destroy();

          return res.status(200).send('Plan deleted');

        } catch (e) {
          console.log('Plan delete error: ', e);
          return res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Plan delete error: ', e);
        return res.status(400).send('Bad request');
      }
    },

  editPlan:
    async (req, res) => {

      try {
        const plan_id = req.query.plan_id;
        const { title, description, public, image } = req.body;

        try {
          const plan = await models.Plan.findByPk(plan_id);

          if (!plan) {
            return res.status(404).send('Plan not found');
          }

          plan.title = title;
          plan.description = description;
          plan.public = public;
          plan.image = image;

          await plan.save();

          return res.status(200).send(plan);

        } catch (e) {
          console.log('Plan edit error: ', e);
          return res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Plan edit error: ', e);
        return res.status(400).send('Bad request');
      }

    },

  togglePlanPublic:
    async (req, res) => {

      try {
        const plan_id = req.query.plan_id;

        try {
          const plan = await models.Plan.findByPk(plan_id);

          if (!plan) {
            return res.status(404).send('Plan not found');
          }

          plan.public = !plan.public;

          await plan.save();

          return res.status(200).send(plan);

        } catch (e) {
          console.log('Plan public error: ', e);
          return res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Plan public error: ', e);
        return res.status(400).send('Bad request');
      }

    },
  getOtherPlans:
    async (req, res) => {
      try {
        console.log('req.body: ', req.body);
        const regions = req.body.regions;
        const user_id = req.body.user_id;

        if (regions && regions.length == 0) {
          return res.status(400).send('Bad request');
        }
        try {
          let final_plans = [];
          for (region of regions) {
            let plans = await models.PlanRegion.findAll({
              where: {
                region_id: region
              },
              include: [{
                model: models.Plan,
                where: {
                  [models.Sequelize.Op.not]: [{ user_id: user_id }],
                  public: true
                }
              }]
            });
            if (!plans) {
              return res.status(404).send('Plans not found');
            }
            plans_id = plans.map(plan => plan.dataValues.plan_id);
            if (plans.length == 0) {
              return res.status(404).send('Plans not found');
            }
          
            let previous_plans = final_plans.length == 0 ? [] : [...final_plans];
            final_plans = plans_id.map(plan_id => {
              if (final_plans.length == 0) {
                return plan_id;
              }
              if (previous_plans.includes(plan_id)) {
                return plan_id;
              }
            });
          }
          
          if (final_plans.length == 0) {
            return res.status(404).send('Plans not found');
          }
          final_plans = final_plans.filter(plan => plan != undefined);

          const final_plans2 = [...final_plans]
          final_plans = []
          for (plan of final_plans2) {
            let plans_all_regions = await models.PlanRegion.findAll({
              where: {
                plan_id: plan
              }
            });
            plans_all_regions = plans_all_regions.map(plan => plan.dataValues.region_id);
            console.log('plans_all_regions: ', plans_all_regions);
            if (plans_all_regions.length == regions.length) {
              final_plans.push(plan);
            }
          }
          if (final_plans.length == 0) {
            return res.status(404).send('Plans not found');
          }

          let final_plans_details = [];
          final_plans_details = await models.Plan.findAll({
            where: {
              id: final_plans
            },
            order: [
              ['copy_count', 'DESC']
            ]
          });
          final_plans_details = final_plans_details.map(plan => {
            return plan.dataValues;
          });
          return res.status(200).send(final_plans_details);
        } catch (e) {
          console.log('Plans get error: ', e);
          return res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Plans get error: ', e);
        return res.status(400).send('Bad request');
      }
    },
  copyPlan:
    async (req, res) => {
      try {
        const plan_id = req.body.plan_id;
        const user_id = req.body.user_id;
        const start_date_raw = req.body.start_date;

        console.log('req.body: ', req.body)

        if (!plan_id || !user_id) {
          return res.status(400).send('Bad request');
        }
        const plan = await models.Plan.findOne({
          where: {
            id: plan_id,
            [models.Sequelize.Op.not]: [{ user_id: user_id }]
          }
        });
        if (!plan) {
          return res.status(404).send('Plan not Copyable');
        }


        plan.copy_count = plan.copy_count + 1;
        await plan.save();


        const start_date = new Date(start_date_raw);
        const day_diff_millis = start_date.getTime() - plan.start_date.getTime();
        const end_date = new Date(plan.end_date);
        end_date.setTime(end_date.getTime() + day_diff_millis);

        const plan_regions = await models.PlanRegion.findAll({
          where: {
            plan_id: plan_id
          }
        });

        const new_plan = await models.Plan.create({
          title: plan.title,
          description: plan.description,
          public: false,
          image: plan.image,
          start_date: start_date,
          end_date: end_date,
          user_id: user_id
        });
        for(plan_region of plan_regions) {
          await models.PlanRegion.create({
            plan_id: new_plan.id,
            region_id: plan_region.dataValues.region_id
          });
        }
        const plan_events = await models.Event.findAll({
          where: {
            plan_id: plan_id
          }
        });
        for(plan_event of plan_events) {
          const start_time = new Date(plan_event.dataValues.start_time);
          start_time.setTime(start_time.getTime() + day_diff_millis);
          const end_time = new Date(plan_event.dataValues.end_time);
          end_time.setTime(end_time.getTime() + day_diff_millis);
          await models.Event.create({
            plan_id: new_plan.id,
            place_id: plan_event.dataValues.place_id,
            activity_id: plan_event.dataValues.activity_id,
            start_time: start_time,
            end_time: end_time,
            day: plan_event.dataValues.day
          });
        }
        return res.status(201).send(new_plan);

      } catch (e) {
        console.log('Plans get error: ', e);
        return res.status(400).send('Bad request');
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

          const regionIds = regions.map(region => region.region_id);

          const tagsPlacesActivities = await calculateExploration(res, plan_id, regionIds);
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


  getExploreOtherRegions: async (req, res) => {
    // take those regions that are not in the plan's region but in the plan's region's nearby region
    try {
      const plan_id = req.query.plan_id;

      try {
        const planRegions = await models.PlanRegion.findAll({
          where: {
            plan_id: plan_id
          }
        });

        if (!planRegions) {
          res.status(404).send('Plan not found');
          return;
        }

        const nearbyRegions = await models.NearbyRegion.findAll({
          where: {
            [models.Sequelize.Op.or]: [
              { first_region_id: planRegions.map(region => region.region_id) },
              { second_region_id: planRegions.map(region => region.region_id) }
            ]
          }
        });

        if (!nearbyRegions) {
          res.status(200).send([]);
        }

        // get unique nearby region ids excluding the plan's region ids
        const nearbyRegionIds = new Set();
        nearbyRegions.forEach(nearbyRegion => {
          nearbyRegionIds.add(nearbyRegion.first_region_id);
          nearbyRegionIds.add(nearbyRegion.second_region_id);
        });
        nearbyRegionIds.forEach(nearbyRegionId => {
          planRegions.forEach(planRegion => {
            if (planRegion.region_id === nearbyRegionId) {
              nearbyRegionIds.delete(nearbyRegionId);
            }
          });
        });

        // get all the regions
        const regions = await models.Region.findAll({
          where: {
            id: [...nearbyRegionIds]
          }
        });

        result = [];
        for (let nearbyRegionId of nearbyRegionIds) {
          const regionResult = await calculateExploration(res, plan_id, nearbyRegionId);
          result.push({
            region_id: nearbyRegionId,
            region_name: regions.find(region => region.id === nearbyRegionId).title,
            tags_places_activities: regionResult
          });
        }

        res.status(200).send(result);

      } catch (e) {
        console.log('Explore other region error: ', e);
        res.status(500).send('Internal server error');
      }

    } catch (e) {
      console.log('Explore other region error: ', e);
      res.status(400).send('Bad request');
    }
  },

}

async function calculateExploration(res, plan_id, regionIds) {

  // get all the places in the regions
  const places = await models.Place.findAll({
    where: {
      region_id: regionIds,
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

  const allActivities = await models.Activity.findAll({
    where: {
      id: activities.map(activity => activity.activity_id)
    },
    attributes: ['id', 'title']
  });

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

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const tag_id = tag.id;

    const tagPlaces = [];
    for (let j = 0; j < places.length; j++) {
      const place = places[j];
      const place_id = place.id;

      const placeActivities = [];
      for (let k = 0; k < activities.length; k++) {
        const activity = activities[k];

        // check whether the activity is already in the plan
        let in_plan = events.find(event => event.place_id === place_id
          && event.activity_id === activity.activity_id) != undefined;

        if (activity.tag_id === tag_id && activity.place_id === place_id) {
          placeActivities.push({
            id: activity.activity_id,
            title: allActivities.find(allActivity => allActivity.id === activity.activity_id).title,
            in_plan: in_plan
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

  return tagsPlacesActivities;
}