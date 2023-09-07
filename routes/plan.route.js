const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const controller = require('../controllers/plan.controller')

router.post('/', auth, controller.createPlan)
router.get('/', auth, controller.getPlan)
router.get('/explore/other', auth, controller.getExploreOtherRegions)
router.get('/explore', auth, controller.getExplorations)
router.post('/update', controller.updatePlan)

module.exports = router