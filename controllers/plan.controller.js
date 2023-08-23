const models = require('../db/models');

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
        const tags = await models.Tag.findAll({
          attributes: ['id']
        })
        final_result =[{}]
        
        for(let i=0;i<tags.length;i++){
          const places = await models.PlaceActivity.findAll({
            where: {
              tag_id: tags[i].id
            },
            attributes: ['place_id']
          });
          let place_details = []
          if(places.length>0){
             place_details= places.map(place =>{
              models.Place.findByPk(place.place_id).then(place_details =>{
                return place_details.type==='spot' ? place_details : null
              })
             })
          }
          console.log(place_details)
        }
      } catch (e) {
        console.log('Explorations get error: ', e);
        res.status(500).send('Internal server error');
      }

    } catch (e) {
      console.log('Explorations get error: ', e);
      res.status(400).send('Bad request');
    }
  }
}