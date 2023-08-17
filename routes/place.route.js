const express = require('express')
const router = express.Router()

const controller = require('../controllers/place.controller')

router.get('/', controller.getPlace)
router.get('/review', controller.getPlaceReview)

module.exports = router