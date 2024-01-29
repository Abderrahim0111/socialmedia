const express = require("express");
const app = express();
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const port = 3000;

const cors = require("cors");
app.use(cors());

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


const userRouter = require('./routes/userRoutes')
app.use('/api' ,userRouter)
const postRouter = require('./routes/postRoutes')
app.use('/api', postRouter)
const chatRouter = require('./routes/chatRoutes')
app.use('/api', chatRouter)
const messageRouter = require('./routes/messageRoutes')
app.use('/api', messageRouter)

const path = require("path");
app.use(express.static(path.join(__dirname, "..", "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});