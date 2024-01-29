const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Post = require("../models/postSchema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const signup = async (req, res) => {
  try {
    const { email, name, username, password } = req.body;
    if (!email || !name || !username || !password) {
      return res.json({ error: "All fields are required!" });
    }
    const isEmail = await User.findOne({ email: email });
    if (isEmail) {
      return res.json({ error: "Email taken!" });
    }
    const isUsername = await User.findOne({ username: username });
    if (isUsername) {
      return res.json({ error: "Username taken!" });
    }
    const user = await User.create(req.body);
    if (!user) {
      return res.json({ error: "Registration error, try again!" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password: pass, ...rest } = user._doc;
    res.cookie("jwt", token, { 
      httpOnly: true, 
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds 
    });
    res.json(rest);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ error: "All fields are required!" });
    }
    const isUser = await User.findOne({ email: email });
    if (!isUser) {
      return res.json({ error: "User don't exist, try to sign up first!" });
    }
    const match = await bcrypt.compare(password, isUser.password);
    if (!match) {
      return res.json({ error: "Incorrect password!" });
    }
    const token = jwt.sign({ id: isUser._id }, process.env.JWT);
    const { password: pass, ...rest } = isUser._doc;
    res.cookie("jwt", token, { 
      httpOnly: true, 
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds 
    });
    
    res.json(rest);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.json({ error: "Not allowed!" });
    }
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ error: "error" });
    }
    res.json(req.file.path);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const updateProfileImage = (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    cloudinary.uploader.upload(req.body[0], async (error, result) => {
      if (result) {
        const update = await User.findByIdAndUpdate(
          decoded.id,
          { profileimage: result.secure_url },
          { new: true }
        );
        if (update) {
          const { password, ...rest } = update._doc;
          return res.json(rest);
        }
      }
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const removeCurrentPhoto = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const update = await User.findByIdAndUpdate(
      decoded.id,
      { profileimage: "" },
      { new: true }
    );
    if (update) {
      const { password, ...rest } = update._doc;
      return res.json(rest);
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const follow = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const user = await User.findOne({ username: req.params.username });

    const isFollower = user.followers.includes(decoded.id);

    if (isFollower) {
      user.followers.pull(decoded.id);
      await User.updateOne(
        { username: req.params.username },
        { followers: user.followers }
      );
      await User.findByIdAndUpdate(decoded.id, {
        $pull: { following: user._id },
      });

      return res.json({ unfollowed: "done" });
    }
    user.followers.push(decoded.id);
    if (!user.following.includes(user._id)) {
      user.following.push(user._id);
    }

    await User.updateOne(
      { username: req.params.username },
      { followers: user.followers }
    );
    const following = await User.findByIdAndUpdate(
      decoded.id,
      { $addToSet: { following: user._id } },
      { new: true }
    );
    const currentUser = await User.findById(decoded.id);

    const notificationMessage = `${currentUser.username} start following you`;
    const notificationSent = await User.updateOne(
      { username: req.params.username },
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

    res.json({ followed: "done" });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const fetchCurrentUser = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const user = await User.findById(decoded.id)
      .populate("notification.user", "-password")
      .lean();
    user.notification.sort((a, b) => b.timestamp - a.timestamp);
    return res.json(user);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
    });
    return res.json(users);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const {password, ...rest} = user._doc
    return res.json(rest);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    if (req.body.profileimage) {
      cloudinary.uploader.upload(
        req.body.profileimage,
        async (error, result) => {
          console.log(result.secure_url);
          const user = await User.findByIdAndUpdate(
            decoded.id,
            {
              profileimage: result.secure_url,
              name: req.body.name,
              email: req.body.email,
              username: req.body.username,
              password: req.body.password,
            },
            { new: true }
          );
          const { password, ...rest } = user._doc;
          res.json(rest);
        }
      );
    } else {
      const user = await User.findByIdAndUpdate(
        decoded.id,
        {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
        { new: true }
      );
      const { password, ...rest } = user._doc;
      res.json(rest);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const savePost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);

    const user = await User.findById(decoded.id)

    const isSaved = user.saves.find((save) => {
      return save == req.params.postId
    })

    if(isSaved){
      const unsaved = await User.findByIdAndUpdate(
        decoded.id,
        {
          $pull: {
            saves: req.params.postId,
          },
        },
        { new: true }
      );
      const {password, ...rest} = user._doc
      return res.json(rest)
    }
 
    const saved = await User.findByIdAndUpdate(
      decoded.id,
      {
        $push: {
          saves: req.params.postId,
        },
      },
      { new: true }
    );
    const {password, ...rest} = user._doc
    res.json(rest)
    
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = {
  login,
  signup,
  logout,
  uploadProfileImage,
  updateProfileImage,
  removeCurrentPhoto,
  follow,
  fetchCurrentUser,
  fetchUsers,
  fetchUser,
  updateProfile,
  savePost,
};
