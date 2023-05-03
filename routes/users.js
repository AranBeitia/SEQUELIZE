const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

router.post('/', UserController.create)
router.get('/', UserController.getAll)
router.get('/id/:id', UserController.getUserById)
router.delete('/id/:id', UserController.delete)
router.put('/id/:id', UserController.update)

module.exports = router
