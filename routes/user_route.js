const express = require("express")
const router = express.Router()
const get_user_infoController = require('../controllers/user')

router.get('/', get_user_infoController)

module.exports = router