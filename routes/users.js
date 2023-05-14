const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authentication, isAdmin } = require('../middlewares/authentication')

router.post('/', UserController.create)
router.post('/login', UserController.login)
router.get('/confirm/:emailToken', UserController.confirm)
router.get('/', authentication, UserController.getAll)
router.get('/id/:id', authentication, UserController.getUserById)
router.delete('/id/:id', authentication, isAdmin, UserController.delete)
router.put('/id/:id', authentication, UserController.update)
router.delete('/logout', authentication, UserController.logout)

module.exports = router
