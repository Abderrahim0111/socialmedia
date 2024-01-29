const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    email: String,
    name: String,
    username: String,
    password: String,
    profileimage: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    notification: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
