import { Router } from "express";
import multer from "multer";
import {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  get_comments_by_post,
  delete_comment_of_user,
  increment_likes,
  commentPost
} from "../controllers/posts.controllers.js";

const router = Router();

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/* ----------- Routes ------------ */

// Health check
router.route("/").get(activeCheck);

// Create a new post (with optional media upload)
router.route("/post").post(upload.single('media'), createPost);

// Get all posts
router.route("/posts").get(getAllPosts);

// Delete a post
router.route("/delete_post").post(deletePost);


router.route("/comment").post(commentPost);


// Get comments by post
router.route("/get_comments").post(get_comments_by_post);

// Delete a comment by user
router.route("/delete_comment").post(delete_comment_of_user);

// Increment likes
router.route("/like_post").post(increment_likes);

export default router;
