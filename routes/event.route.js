const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const controller = require('../controllers/event.controller')

router.get('/', auth, controller.getEvents)
router.get('/detail', auth, controller.getEventDetail)
router.put('/detail', auth, controller.updateEventDetail)
router.get('/suggestion', auth, controller.getSuggestion)

module.exports = router