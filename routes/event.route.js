const express = require('express')
const router = express.Router()

const controller = require('../controllers/event.controller')

router.get('/', controller.getEvent)
router.get('/detail', controller.getEventDetail)
router.put('/detail', controller.updateEventDetail)

module.exports = router