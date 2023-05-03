const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')

router.post('/', PostController.create)
router.get('/', PostController.getAll)
router.get('/id/:id', PostController.getById)
router.get('/title/:title', PostController.getOneByName)
router.delete('/id/:id', PostController.delete)

module.exports = router
