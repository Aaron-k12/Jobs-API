const express = require('express')
const router = express.Router()


// Importing models from the controller
const { register, login } = require('../controllers/auth')


router.post('/register', register)
router.post('/login', login)

module.exports = router