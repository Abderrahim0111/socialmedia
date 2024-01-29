const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    pictures: [String],
    description: String,
    location: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        timestamp: { type: Date, default: Date.now },
      },
    ], 
    seenBy: { type: String, default: "everyone" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
