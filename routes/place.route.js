const express = require('express')
const router = express.Router()

const controller = require('../controllers/place.controller')

router.get('/', controller.getPlace)

module.exports = router