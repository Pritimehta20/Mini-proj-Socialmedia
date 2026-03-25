import express from "express";
import {
  createPost,
  getPosts,
  likePost,
  commentPost
} from "../Controller/postcontroller.js";

import protect from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";

const postroute= express.Router();

postroute.post("/",protect,upload.single("image"),createPost);

postroute.get("/",protect,getPosts);

postroute.put("/:id/like",protect,likePost);

postroute.post("/:id/comment",protect,commentPost);

export default postroute;