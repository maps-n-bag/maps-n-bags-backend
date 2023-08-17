const express = require('express')
const router = express.Router()

const controller = require('../controllers/event.controller')

// router.get('/', get_event)
// router.get('/distance/', get_event_distance)
// router.get('/detail/', get_event_detail)

router.get('/', controller.getEvent)

module.exports = router