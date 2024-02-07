const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");
const multer = require("../middleware/fileUpload");
router.get("/all/:loadCycle", PostsController.getAllPosts);
router.get("/:id", PostsController.getPostsByUser);
router.post("/", multer.single("images"), PostsController.createPost);

module.exports = router;
