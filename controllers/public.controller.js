const { Op } = require('sequelize');
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

  getBlogs:
    async (req, res) => {
      try {
        const plans = await models.Plan.findAll({
          where: { public: true },
          attributes: ['id', 'title', 'description', 'image', 'start_date', 'end_date'],
          order: [['start_date', 'DESC']]
        });
        res.status(200).send(plans);
      } catch (e) {
        console.log('Blogs get error: ', e);
        res.status(500).send('Internal server error');
      }
    },

  getBlog:
    async (req, res) => {
      try {
        const plan_id = req.query.plan_id;

        const plan = await models.Plan.findOne({
          where: { id: plan_id, public: true }
        });

        if (!plan) {
          return res.status(404).send('Blog not found');
        }

        const start_date = plan.start_date;
        const end_date = plan.end_date;
        const noOfDays = (end_date - start_date) / (1000 * 60 * 60 * 24) + 1;

        const dayWiseEvents = [];
        for (let i = 1; i <= noOfDays; i++) {
          const eventsList = await calculateEventsListForBlog(plan_id, noOfDays, i);
          dayWiseEvents.push({ day: i, events: eventsList });
        }

        res.status(200).send({
          plan_id: plan_id,
          plan_title: plan.title,
          plan_description: plan.description,
          plan_start_date: plan.start_date,
          plan_end_date: plan.end_date,
          plan_image: plan.image,
          dayWiseEvents
        });
      } catch (e) {
        console.log('Blog get error: ', e);
        res.status(500).send('Internal server error');
      }
    },

};

async function calculateEventsListForBlog(plan_id, noOfDays, day) {
  const activities = await models.Activity.findAll({ order: [['id', 'ASC']] });

  const currentDayEvents = await models.Event.findAll({
    where: { plan_id, day },
    order: [['start_time', 'ASC']]
  });

  if (!currentDayEvents) return [];

  const result = [];
  let previousEventPlaceId = null;

  if (day == 1) {
    const firstEventPlace = await models.Place.findByPk(currentDayEvents[0].place_id);
    const firstEventRegion = await models.Region.findByPk(firstEventPlace.region_id);
    previousEventPlaceId = firstEventRegion.representative_place_id;
  } else {
    const previousDayEvents = await models.Event.findAll({
      where: { plan_id, day: day - 1 },
      order: [['start_time', 'ASC']]
    });
    previousEventPlaceId = previousDayEvents[previousDayEvents.length - 1].place_id;
  }

  for (let i = 0; i < currentDayEvents.length; i++) {
    const currentEvent = currentDayEvents[i];
    const currentEventPlaceId = currentEvent.place_id;

    const journey = await models.Distance.findOne({
      where: {
        [Op.or]: [
          { first_place_id: previousEventPlaceId, second_place_id: currentEventPlaceId },
          { first_place_id: currentEventPlaceId, second_place_id: previousEventPlaceId }
        ]
      },
      attributes: ['journey_type', 'distance', 'est_time']
    });

    let modifiedJourney = null;
    if (journey) {
      const previousEventPlace = await models.Place.findByPk(previousEventPlaceId);
      const currentEventPlace = await models.Place.findByPk(currentEventPlaceId);
      modifiedJourney = {
        journey_type: journey.journey_type,
        distance: journey.distance,
        est_time: journey.est_time,
        from: previousEventPlace.title,
        to: currentEventPlace.title
      };
    }

    let currentEventDetail = await models.EventDetail.findOne({ where: { event_id: currentEvent.id } });
    let currentEventImages = await models.EventImage.findAll({ where: { event_id: currentEvent.id } });
    if (currentEventDetail) currentEventDetail = currentEventDetail.dataValues;
    if (currentEventImages) currentEventImages = currentEventImages.map(image => image.link);

    const currentEventPlace = await models.Place.findByPk(currentEventPlaceId);
    result.push({
      journey: modifiedJourney,
      event: {
        start_time: currentEvent.start_time,
        end_time: currentEvent.end_time,
        place_name: currentEventPlace.title,
        activity: activities[currentEvent.activity_id - 1].title,
        eventDetail: currentEventDetail,
        eventImages: currentEventImages
      }
    });

    previousEventPlaceId = currentEventPlaceId;
  }

  if (day == noOfDays) {
    const lastEvent = currentDayEvents[currentDayEvents.length - 1];
    const lastEventPlace = await models.Place.findByPk(lastEvent.place_id);
    const lastEventRegion = await models.Region.findByPk(lastEventPlace.region_id);
    const lastEventRegionCenterId = lastEventRegion.representative_place_id;

    const journey = await models.Distance.findOne({
      where: {
        [Op.or]: [
          { first_place_id: lastEvent.place_id, second_place_id: lastEventRegionCenterId },
          { first_place_id: lastEventRegionCenterId, second_place_id: lastEvent.place_id }
        ]
      },
      attributes: ['journey_type', 'distance', 'est_time']
    });

    result.push({
      journey: { ...journey.dataValues, from: lastEventPlace.title, to: lastEventRegion.title },
      event: null
    });
  }

  return result;
}
