const express = require("express");
const {
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
  savePost
} = require("../controllers/userControllers");
const { requireAuth } = require("../middleware/usermiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({}) });

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);
router.post(
  "/uploadProfileImage",
  upload.single("profileimage"),
  uploadProfileImage
);
router.put("/updateProfileImage", requireAuth, updateProfileImage);
router.put("/removeCurrentPhoto", requireAuth, removeCurrentPhoto);
router.put("/follow/:username", requireAuth, follow);
router.get("/fetchCurrentUser", requireAuth, fetchCurrentUser);
router.get("/fetchUsers", requireAuth, fetchUsers);
router.get("/fetchUser/:userId", requireAuth, fetchUser);
router.put("/updateProfile", requireAuth, updateProfile);
router.put('/savePost/:postId', requireAuth, savePost)

module.exports = router;
