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
        res.status(201).send(plan);

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
      }
}