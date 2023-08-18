const express = require('express')
const router = express.Router()

const controller = require('../controllers/public.controller')

router.get('/place', controller.getPlace)
router.get('/place/review', controller.getPlaceReview)
router.get('/tags', controller.getTags)
router.get('/regions', controller.getRegions)
router.get('/nearby/restaurant', controller.getNearbyRestaurant)

module.exports = router