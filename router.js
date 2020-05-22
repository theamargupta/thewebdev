const express = require('express')
const router = express.Router()
const userController=require('./controllers/userController')
const postController = require('./controllers/postController')

// user related routes
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// post related routes
router.get('/create-post', userController.mustLog, postController.viewCreateScreen)
router.post('/create-post', userController.mustLog, postController.create )
router.get('/post/:id', postController.viewSingle)

module.exports = router