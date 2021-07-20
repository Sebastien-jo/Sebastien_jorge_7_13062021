// Imports
const express = require("express");
const postsCtrl = require("../controllers/posts");
const commentCtrl = require("../controllers/comments")
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const router = express.Router();

// Routes posts
router.post("/",auth, multer, postsCtrl.createPost);
router.get("/getPosts", auth, multer, postsCtrl.getAllPosts);
router.delete("/:id", auth, multer, postsCtrl.deletePost);
//projet d'amélioration
//router.put("/", auth, postsCtrl.updatePost)

// Routes comments
router.post("/comment", auth,commentCtrl.createComment);
router.delete("/comment/:id", auth, commentCtrl.deleteComment);
module.exports = router;