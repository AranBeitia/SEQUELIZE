const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authentication } = require('../middlewares/authentication')

router.post('/', UserController.create)
router.get('/', UserController.getAll)
router.get('/id/:id', UserController.getUserById)
router.delete('/id/:id', UserController.delete)
router.put('/id/:id', UserController.update)
router.post('/login', UserController.login)
router.delete('/logout', authentication, UserController.logout)

module.exports = router
