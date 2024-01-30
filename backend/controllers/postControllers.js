const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uplodaPostFiles = async (req, res) => {
  let postImages = [];
  try {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      if (result) {
        postImages.push(result.secure_url);
      }
    }
    return res.json(postImages);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const { pictures, description, location, seenBy } = req.body;
    if (!pictures) {
      return res.json({ error: "You must post at least one picture!" });
    }
    const post = await Post.create({
      pictures: pictures,
      description: description,
      location: location,
      seenBy: seenBy,
      user: decoded.id,
    });
    if (!post) {
      return res.json({ error: "Post creation error, try again!" });
    }
    const thisPost = await Post.findById(post._id).populate(
      "user",
      "-password"
    );

    const postUserFollowers = thisPost.user.followers.map(
      async (followerId) => {
        const ddd = await User.findByIdAndUpdate(
          followerId,
          {
            $push: {
              notification: {
                user: thisPost.user._id,
                message: `${thisPost.user.username} created a new post`,
              },
            },
          },
          {
            new: true,
          }
        );
      }
    );

    return res.json(thisPost);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("followers", "-password")
      .populate("following", "-password");
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    if (user && posts) {
      return res.json({ posts, user });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const fetchPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "-password")
      .populate("comments.user", "-password");
    if (!post) return res.json({ error: "Invalid post id" });
    res.json(post);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const fetchAllPosts = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const user = await User.findById(decoded.id);
    const posts = await Post.find({
      $or: [
        { seenBy: "everyone" },
        { seenBy: "friends", user: { $in: user.following } },
        { user: decoded.id },
      ],
    })
      .populate("user", "-password")
      .populate("likes")
      .populate("comments.user", "-password")
      .sort({ createdAt: -1 });
    if(posts){
      return res.json(posts);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const updateLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const currentUser = await User.findById(decoded.id);
    const postOwner = await User.findById(post.user);

    const followers = postOwner.followers;
    const postLikes = post.likes.filter((like) => {
      return like.toString() === decoded.id;
    });
    if (postLikes.length > 0) {
      post.likes.pull(decoded.id);
      const unlikedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        { likes: post.likes },
        { new: true }
      );
      const notificationMessagee = `${currentUser.username} unliked your post`;
      const notificationSentt = await User.findByIdAndUpdate(
        postOwner._id,
        {
          $push: {
            notification: {
              user: decoded.id,
              message: notificationMessagee,
            },
          },
        },
        { new: true }
      );
      return res.json({ unliked: "unliked" });
    }
    post.likes.push(decoded.id);
    const likedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { likes: post.likes },
      { new: true }
    );

    const notificationMessage = `${currentUser.username} liked your post`;
    const notificationSent = await User.findByIdAndUpdate(
      postOwner._id,
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

    return res.json({ liked: "liked" });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const { comment } = req.body;
    const post = await Post.findById(req.params.postId);
    const currentUser = await User.findById(decoded.id);
    const postOwner = await User.findById(post.user);
    post.comments.push({
      user: decoded.id,
      comment: comment,
    });
    const commented = await Post.findByIdAndUpdate(
      req.params.postId,
      { comments: post.comments },
      { new: true }
    ).lean();
    commented.comments.sort((a, b) => b.timestamp - a.timestamp);
    if (commented) {
      const notificationMessage = `${currentUser.username} commented your post by ${comment}`;
      const notificationSent = await User.findByIdAndUpdate(
        postOwner._id,
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
      return res.json(commented);
    }
  } catch (error) {
    return res.json(error.message);
  }
};

const fetchUserSavedPosts = async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username})
    const posts = await Post.find({
      _id: user.saves
    })
    return res.json(posts)
  } catch (error) {
    return res.json({error: error.message})
  }
}

const fetchLikedPosts = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const posts = await Post.find()
    const sort = req.query.sort || 'createdAt'
    const order = req.query.order || 'desc'
    const postsLikedByCurrentUser = posts.filter((post) => {
      return post.likes.includes(decoded.id)
    })
    res.json(postsLikedByCurrentUser)
  } catch (error) {
    return res.json({error: error.message})
  }
}

const fetchCommentedPosts = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT);
    const posts = await Post.find();
    const postsCommentedByCurrentUser = posts.filter((post) => {
      return post.comments.some((comment) => comment.user.toString() === decoded.id);
    });
    res.json(postsCommentedByCurrentUser);
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT)

    const post = await Post.findById(req.params.postId)

    if(post && post.user.toString() === decoded.id.toString()){
      const update = await Post.findByIdAndDelete(req.params.postId)
      return res.json('post deleted')
    }
    res.json({error: 'invalid information'})
  } catch (error) {
    return res.json({error: error.message})
  }
}

const editComment = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT)

    const post = await Post.findById(req.params.postId)

    const commentIndex = post.comments.findIndex((comment) => {
      return comment._id.toString() === req.params.commentId.toString()
    })

    const comment = post.comments.find((comment) => {
      return comment._id.toString() === req.params.commentId.toString()
    })

    if(post && commentIndex !== -1 && req.body.newComment && comment.user.toString() === decoded.id.toString()){
      const update = await Post.findByIdAndUpdate(req.params.postId, {
        $set: {
          [`comments.${commentIndex}.comment`]: req.body.newComment
        }
      }, {new: true})
  
      return res.json('updated')
    }
    res.json({error: 'invalid information'})
  } catch (error) {
    return res.json({error: error.message})
  }
}

const deleteComment = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT)

    const post = await Post.findById(req.params.postId)

    const comment = post.comments.find((comment) => {
      return comment._id.toString() === req.params.commentId.toString()
    })
    if(post && comment && comment.user.toString() === decoded.id.toString()){
      const update = await Post.findByIdAndUpdate(req.params.postId, {
        $pull: {
          comments: {
            _id: req.params.commentId
          }
        }
      }, {new: true})
  
      return res.json('updated')
    }
    res.json({error: 'invalid information'})
  } catch (error) {
    return res.json({error: error.message})
  }
}

 
module.exports = {
  createPost,
  fetchUserPosts,
  fetchPost,
  fetchAllPosts,
  uplodaPostFiles,
  updateLikes,
  addComment,
  fetchUserSavedPosts,
  fetchLikedPosts,
  fetchCommentedPosts,
  deletePost,
  editComment,
  deleteComment,
};
