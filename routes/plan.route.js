const express = require('express')
const router = express.Router()

const controller = require('../controllers/plan.controller')

router.post('/', controller.createPlan)
router.get('/', controller.getPlan)
router.get('/explore', controller.getExplorations)

module.exports = router