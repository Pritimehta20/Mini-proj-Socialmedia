import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../Config/cloudinary.js';
import Post from '../Model/post.js';


export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = "";

    console.log("TEXT:", text);
    console.log("FILE:", req.file); // 🔥 DEBUG

    // 🔹 If image exists
    if (req.file) {
  try {
    if (!req.file.buffer) {
      return res.status(400).json({ error: "File buffer missing" });
    }

    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataURI);

    imageUrl = result.secure_url;

  } catch (err) {
    console.error("Cloudinary Error:", err);
    console.log("BODY:", req.body);
console.log("FILE FULL:", req.file);
console.log("BUFFER:", req.file?.buffer);
    return res.status(500).json({
      error: "Image upload failed"
    });
  }
}

    // 🔹 Validation
    if (!text && !imageUrl) {
      return res.status(400).json({
        error: "Text or Image required"
      });
    }

    const newPost = await Post.create({
      user: req.user._id,
      text,
      image: imageUrl
    });

    res.status(201).json(newPost);

  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("likes", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((p) => ({
      _id: p._id,
      user: p.user.name,
      useremail:p.user.email,
      text: p.text,
      image: p.image,

      likesCount: p.likes.length,
      commentsCount: p.comments.length,
      createdAt: p.createdAt, 
      likedBy: p.likes.map((u) => u.name),

      comments: p.comments.map((c) => ({
        user: c.user.name,
        text: c.text
      }))
    }));

    res.json(formattedPosts);

  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postDoc = await Post.findById(req.params.id); // ✅ FIX

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = postDoc.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      postDoc.likes = postDoc.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      postDoc.likes.push(userId);
    }

    await postDoc.save();

    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      totalLikes: postDoc.likes.length
    });

  } catch (error) {
    console.error("Like Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment required" });
    }

    const postDoc = await Post.findById(req.params.id); // ✅ FIX

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    postDoc.comments.push({
      user: req.user._id,
      text
    });

    await postDoc.save();

    res.json({
      message: "Comment added",
      totalComments: postDoc.comments.length
    });

  } catch (error) {
    console.error("Comment Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};