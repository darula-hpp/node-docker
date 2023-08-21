import Post from "../models/Post.js";
import StatusCodes from "http-status-codes";

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.status(StatusCodes.OK).json(posts);
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "failed" });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(StatusCodes.CREATED).json(post);
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "failed" });
  }
};

export { getAllPosts, createPost };
