const models = require('../db/models');
const {createPlan}=require('./create.plan')
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
        
        if(!plan) {
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
        const regions = await models.PlanRegion.findAll({
          where: {
            plan_id: plan_id
          }
        });

        if (!regions) {
          res.status(404).send('Plan not found');
          return;
        }

        const places = await models.Place.findAll({
          where: {
            region_id: regions.map(region => region.region_id)
          }
        });
        
        if (!places) {
          res.status(404).send('Places not found');
          return;
        }

        const placeActivities = await models.PlaceActivity.findAll({
          where: {
            place_id: places.map(place => place.id)
          }
        });

        if (!placeActivities) {
          res.status(404).send('Place activities not found');
          return;
        }

        const tagPlaceActivities = {};
        for (let i=0; i<placeActivities.length; i++) {
          const placeActivity = placeActivities[i];
          const tag_id = placeActivity.tag_id;

          if (!tagPlaceActivities[tag_id]) {
            tagPlaceActivities[tag_id] = {};
          }

          if (!tagPlaceActivities[tag_id][placeActivity.place_id]) {
            tagPlaceActivities[tag_id][placeActivity.place_id] = [];
          }

          tagPlaceActivities[tag_id][placeActivity.place_id].push(placeActivity.activity_id);
        }

        res.status(200).send(tagPlaceActivities);

      } catch (e) {
        console.log('Explorations get error: ', e);
        res.status(500).send('Internal server error');
      }

    } catch (e) {
      console.log('Explorations get error: ', e);
      res.status(400).send('Bad request');
    }

  },
  getExplorationsModified : async (req, res) => {
    try {
      const plan_id = req.query.plan_id;

      try {
        const regions = await models.PlanRegion.findAll({
          where: {
            plan_id: plan_id
          }
        });

        if (!regions) {
          res.status(404).send('Plan not found');
          return;
        }
        const tags = await models.Tag.findAll()
        final_result =[{}]

        // all place activities pair in the plan
        const placeActivitiesPlan = await models.Event.findAll({
          where: {
            plan_id: plan_id
          },
          attributes: ['place_id', 'activity_id']
          });
        
        all_places = await models.Place.findAll({
          where: {
            region_id: regions.map(region => region.region_id),
            type: 'spot'
          },
          attributes: ['id','title','rating','rating_count']
        });
          all_activities = await models.Activity.findAll(
            {
              attributes: ['id','title']
            }
          )
          all_images = await models.Place.findAll({
            where: {
              region_id: regions.map(region => region.region_id),
              type: 'spot'
            },
            include: [{
              model: models.PlaceImage,
              attributes: ['link']
            }],
            attributes: ['id']
          });
          for (let i=0; i<tags.length; i++) {
            const tag = tags[i];
            const placeActivities = await models.PlaceActivity.findAll({
              where: {
                tag_id: tag.id,
              },
              unique: true,
              attributes: ['place_id']
            });
            result=await Promise.all(placeActivities.map(async(placeActivity) =>{
              activities= await models.PlaceActivity.findAll({
                where:{
                  place_id:placeActivity.place_id,
                  tag_id:tag.id
                },
                attributes: ['activity_id']
              })
              place_detail_required =await Promise.all(all_places.filter(place => place.id == placeActivity.place_id))
              activity_detail_required = activities.map(activity => all_activities.filter(activity_detail => activity_detail.id == activity.activity_id))
              const images = all_images.find(image => image.id === placeActivity.place_id);
              // check whether the place activity already in the plan 
              // something like this 
              // placeActivitiesPlan.find(placeActivityPlan => placeActivityPlan.place_id === placeActivity.place_id && placeActivityPlan.activity_id === placeActivity.activity_id)
              return {
                ...place_detail_required,
                images: images ? images.dataValues.PlaceImage.link: [],
                activities:activity_detail_required
            }
          }))
            final_result.push({
              tag_id:tag.id,
              tag_name:tag.title,
              places:result
          })
        }
        res.status(200).send(final_result);
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