const express = require("express")
const router = express.Router()

const controller = require('../controllers/user.controller')

router.get('/', controller.getUser)
router.post('/', controller.createUser)
router.put('/', controller.updateUser)
router.post('/login', controller.login)
router.put('/password', controller.updatePassword)

module.exports = router