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

  getPlaceReview:
    async (req, res) => {

      try {
        const place_id = req.query.place_id;

        try {
          const reviews = await models.Review.findAll({
            where: {
              place_id: place_id
            }
          });

          if (!reviews) {
            res.status(404).send('Place not found');
          }

          const reviewImages = await models.ReviewImage.findAll({
            where: {
              place_id: place_id
            }
          });

          const response = reviews.map(review => {
            return {
              ...review,
              images: reviewImages.map(image => image.link)
            }
          });

          res.status(200).send(response);

        } catch (e) {
          console.log('Place review get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Place review get error: ', e);
        res.status(400).send('Bad request');
      }

    },

  getTags:
    async (req, res) => {

      // return first 10 tags
      try {
        const tags = await models.Tag.findAll({
          limit: 10
        });

        res.status(200).send(tags);

      } catch (e) {
        console.log('Tags get error: ', e);
        res.status(500).send('Internal server error');
      }

    },

  getRegions:
    async (req, res) => {

      try {
        const regions = await models.Region.findAll({
          attributes: ['id', 'title']
        });

        res.status(200).send(regions);

      } catch (e) {
        console.log('Regions get error: ', e);
        res.status(500).send('Internal server error');
      }

    }

};