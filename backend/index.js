const express = require("express");
const app = express();
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

const cors = require("cors");
app.use(cors({
  origin: "https://socialsnap-eta.vercel.app",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));


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
