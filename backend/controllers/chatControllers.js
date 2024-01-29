const Chat = require("../models/chatSchema");
const jwt = require("jsonwebtoken");
const User = require('../models/userSchema')

const accesChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const usertochatwith = await User.findById(userId)
    const otherUserName = usertochatwith.username;
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    if (!userId) {
      return res.json({ error: "select a user to chat with first" });
    }
    const isChat = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: decoded.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    });
    if (isChat.length > 0) {
        console.log('ischat')
      return res.json(isChat);
    }
    const chat = await Chat.create({
      users: [decoded.id, userId],
    });
    res.json(chat);
    console.log('chat created')
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const fetchChats = async (req, res) => {
    try {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT)
        const chats = await Chat.find({
            users: {$elemMatch: {$eq: decoded.id}}
        }).populate("users", "-password").populate("latestMessage").sort({createdAt: -1})
        res.json(chats)
    } catch (error) {
        return res.json({error: error.message})
    }
}

const fetchChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate("users", "-password").sort({createdAt: -1})
        res.json(chat)
    } catch (error) {
        return res.json({error: error.message})
    }
}

module.exports = {
  accesChat,
  fetchChats,
  fetchChat,
};
