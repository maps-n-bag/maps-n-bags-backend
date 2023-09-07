const express = require("express")
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const controller = require('../controllers/user.controller')

// auth
router.get('/', auth, controller.getUser)
router.put('/password', auth, controller.updatePassword)
router.put('/', auth, controller.updateUser)

// no auth
router.post('/login', controller.login)
router.post('/', controller.createUser)

module.exports = router