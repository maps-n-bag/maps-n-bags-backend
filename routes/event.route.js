const express = require('express')
const router = express.Router()

const controller = require('../controllers/event.controller')

router.get('/', controller.getEvent)

module.exports = router