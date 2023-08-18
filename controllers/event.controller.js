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
          else {

            const result = [];
            for (let i = 0; i < events.length; i++) {
              const event = events[i];
              result.push({
                'journey': null, // for now
                'event': event
              });
            }

            res.status(200).send(result);
          }

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
          const eventDetail = await models.EventDetail.findOne({
            where: {
              event_id: event_id
            }
          });

          if (!eventDetail) {
            res.status(404).send('Event not found');
          } else {

            const eventImages = await models.EventImage.findAll({
              where: {
                event_id: event_id
              }
            });

            const result = {...eventDetail, images: eventImages.map(image => image.link)};
            
            res.status(200).send(result);
            
          }

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
        const event_id = req.query.event_id;
        const { checked, note, generated_details, expenditure, images } = req.body;

        try {
          const eventDetail = await models.EventDetail.findOne({
            where: {
              event_id: event_id
            }
          });

          if (!eventDetail) {
            res.status(404).send('Event not found');
          }
          else {

            eventDetail.update({
              checked,
              note,
              generated_details,
              expenditure
            });

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
          }

        } catch (e) {
          console.log('Event update error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Event update error: ', e);
        res.status(400).send('Bad request');
      }

  }

}
