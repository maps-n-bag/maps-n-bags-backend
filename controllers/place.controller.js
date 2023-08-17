const models = require('../db/models');

module.exports = {

  getPlace:
    async (req, res) => {

      try {
        const place_id = req.query.id;

        try {
          const place = await models.Place.findByPk(place_id);

          if (!place) {
            res.status(404).send('Place not found');
          }

          const placeImages = await models.PlaceImage.findAll({
            where: {
              place_id: place_id
            }
          });

          place = {...place, images: placeImages.map(image => image.link)};
          res.status(200).send(place);

        } catch (e) {
          console.log('Place get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Place get error: ', e);
        res.status(400).send('Bad request');
      }
    
    },

};