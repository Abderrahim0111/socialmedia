const express = require('express')
const { accesChat, fetchChats, fetchChat } = require('../controllers/chatControllers')
const { requireAuth } = require('../middleware/usermiddleware')
const router = express.Router()


router.post('/accesChat', requireAuth, accesChat)
router.get('/fetchChats', requireAuth, fetchChats)
router.get('/fetchChat/:chatId', requireAuth, fetchChat)



module.exports = router