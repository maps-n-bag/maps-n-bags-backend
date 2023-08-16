const express = require("express")
const router = express.Router()

const controller = require('../controllers/user')

router.get('/', controller.get)
router.post('/', controller.post)
router.put('/', controller.put)

module.exports = router