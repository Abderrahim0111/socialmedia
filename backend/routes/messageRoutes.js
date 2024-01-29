const express = require('express')
const { fetchAllMessages, sendMessage } = require('../controllers/messageControllers')
const { requireAuth } = require('../middleware/usermiddleware')
const router = express.Router()

 
router.get('/fetchAllMessages/:chatId', requireAuth, fetchAllMessages)
router.post('/sendMessage', requireAuth, sendMessage)



module.exports = router