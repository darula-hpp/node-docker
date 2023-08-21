import express from "express";
import { createPost, getAllPosts } from "../controllers/postController.js";

const router = express.Router();

router.route("/").post(createPost).get(getAllPosts);

export default router;
