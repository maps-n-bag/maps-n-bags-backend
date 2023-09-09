const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const controller = require('../controllers/plan.controller')

router.post('/', auth, controller.createPlan)
router.get('/', auth, controller.getPlan)
router.get('/all', auth, controller.getAllPlans)
router.delete('/', auth, controller.deletePlan)
router.get('/explore/other', auth, controller.getExploreOtherRegions)
router.get('/explore', auth, controller.getExplorations)
router.post('/update', auth, controller.updatePlan)
router.put('/edit', auth, controller.editPlan)
router.put('/edit/public', auth, controller.togglePlanPublic)

module.exports = router