const Chat = require("../models/chatSchema")
const Message = require("../models/messageSchema")
const jwt = require('jsonwebtoken')
const User = require("../models/userSchema")


const fetchAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId
        }).populate("chat").populate("sender", "-password")
        res.json(messages)
    } catch (error) {
        return res.json({error: error.message})
    }
}

const sendMessage = async (req, res) => {
    try {
        const {content, chatId} = req.body
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT)
        const currentUser = await User.findById(decoded.id)
        const message = await Message.create({
            sender: decoded.id,
            message: content,
            chat: chatId
        })
        const ddd = await Message.findById(message._id).populate("sender", "-password").populate("chat")
        const updatedLastMessage = await Chat.findByIdAndUpdate(ddd.chat._id, {latestMessage: ddd._id}, {new: true}).populate("latestMessage")
        
        const messageTo = updatedLastMessage.users.find((user) => {
            return user != decoded.id
        })
        const notificationMessage = `${currentUser.username} sent you a new message: ${content}`;
        const notificationSent = await User.findByIdAndUpdate(
        messageTo,
        {
          $push: {
            notification: {
              user: decoded.id,
              message: notificationMessage,
            },
          },
        },
        { new: true }
        );
        return res.json(ddd)
    } catch (error) {
        return res.json({error: error.message})
    }
}

module.exports = {
    fetchAllMessages,
    sendMessage,
}