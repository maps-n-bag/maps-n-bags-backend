const { response } = require('express');
const models = require('../db/models');

module.exports = {

  getEvent:
    async (req, res) => {

      try {
        const plan_id = req.query.plan_id;
        const day = req.query.day;

        try {
          const events = await models.Event.findAll({
            where: {
              plan_id: plan_id,
              day: day
            },
            order: [
              ['start_time', 'ASC']
            ]
          });

          if (!events) {
            res.status(404).send('Events not found');
          }

          response = [];
          for (let i = 0; i < events.length; i++) {
            const event = events[i];
            response.push({
              'journey': null, // for now
              'event': event
            });
          }

          res.status(200).send(response);

        } catch (e) {
          console.log('Events get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Events get error: ', e);
        res.status(400).send('Bad request');
      }
    },

  }