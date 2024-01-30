const express = require("express");
const {
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
  editComment,
  deleteComment,
  deletePost,
} = require("../controllers/postControllers");
const { requireAuth } = require("../middleware/usermiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({}) });

router.post("/uplodaPostFiles", upload.array("files", 12), uplodaPostFiles);
router.post("/createPost", requireAuth, createPost);
router.get("/fetchUserPosts/:username", requireAuth, fetchUserPosts);
router.get("/fetchPost/:postId", requireAuth, fetchPost);
router.get("/fetchAllPosts", requireAuth, fetchAllPosts);
router.put("/updateLikes/:postId", requireAuth, updateLikes);
router.put("/addComment/:postId", requireAuth, addComment);
router.get("/fetchUserSavedPosts/:username", requireAuth, fetchUserSavedPosts);
router.get("/fetchLikedPosts", requireAuth, fetchLikedPosts);
router.get("/fetchCommentedPosts", requireAuth, fetchCommentedPosts);
router.put("/editComment/:postId/:commentId", requireAuth, editComment);
router.put("/deleteComment/:postId/:commentId", requireAuth, deleteComment);
router.delete("/deletePost/:postId", requireAuth, deletePost);

module.exports = router;
