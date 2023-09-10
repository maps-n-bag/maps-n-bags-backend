const models = require('../db/models');

module.exports = {

  getPlace:
    async (req, res) => {

      try {
        const place_id = req.query.id;

        try {
          const place = await models.Place.findByPk(place_id);

          if (!place) {
            return res.status(404).send('Place not found');
          }

          const region = await models.Region.findByPk(place.region_id);

          const placeImages = await models.PlaceImage.findAll({
            where: {
              place_id: place_id
            }
          });

          const response = { ...place.dataValues, region_name: region.title, images: placeImages.map(image => image.link) };
          return res.status(200).send(response);

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
          else {

            const result = [];
            for (let i = 0; i < reviews.length; i++) {
              const reviewImages = await models.ReviewImage.findAll({
                where: {
                  review_id: reviews[i].id
                }
              });
              result.push({
                ...reviews[i].dataValues,
                images: reviewImages.map(image => image.link)
              });
            }

            res.status(200).send(result);
          }

        } catch (e) {
          console.log('Place review get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Place review get error: ', e);
        res.status(400).send('Bad request');
      }

    },

  addPlaceReview:
    async (req, res) => {

      try {
        const place_id = req.query.place_id;
        const { user_id, comment, rating, images } = req.body;

        try {
          const place = await models.Place.findByPk(place_id);
          if (!place)
            return res.status(404).send('Place not found');

          const user = await models.User.findByPk(user_id);

          const review = await models.Review.create({
            username: user.username,
            place_id: place_id,
            comment: comment,
          });

          images.forEach(async (image) => {
            await models.ReviewImage.create({
              review_id: review.id,
              link: image
            });
          });

          return res.status(200).send({ ...review.dataValues, images: images });

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

    },

  getNearbyRestaurant:
    async (req, res) => {

      try {
        const place_id = req.query.place_id;

        try {
          const place = await models.Place.findByPk(place_id);
          if (!place) {
            res.status(404).send('Place not found');
            return;
          }

          const nearbyRestaurant = await models.Place.findOne({
            where: {
              type: 'restaurant',
              region_id: place.region_id,
              id: {
                [models.Sequelize.Op.ne]: place_id
              },
            },
            order: models.sequelize.literal('(latitude-' + place.latitude + ')*(latitude-' + place.latitude + ') + (longitude-' + place.longitude + ')*(longitude-' + place.longitude + ') ASC'),
          });

          if (!nearbyRestaurant) {
            res.status(404).send('Nearby restaurants not found');
            return;
          }

          const nearbyRestaurantImages = await models.PlaceImage.findAll({
            where: {
              place_id: nearbyRestaurant.id
            }
          });

          const response = { ...nearbyRestaurant.dataValues, images: nearbyRestaurantImages.map(image => image.link) };
          res.status(200).send(response);

        } catch (e) {
          console.log('Nearby restaurants get error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('Nearby restaurants get error: ', e);
        res.status(400).send('Bad request');
      }

    },

};