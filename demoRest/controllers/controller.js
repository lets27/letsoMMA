import bcrypt from "bcryptjs";
import { createRequire } from "module";

import mongoose from "mongoose";
import {
  addComment,
  addPost,
  allComments,
  createUser,
  editPost,
  erasePost,
  getAllPosts,
  getSinglePost,
  getUser,
  specPost,
  wipeComment,
} from "../database/queries.js";

const require = createRequire(import.meta.url);
import pkg from "jsonwebtoken";
import "dotenv/config";
const { sign, verify } = pkg;
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Post from "../database/models/postModel.js";
const { body, validationResult } = require("express-validator");
const secretKey = process.env.secretKey;

//// image upload for a new post
// Setup multer buffer store
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.cloudname,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

//signup
//validation checks
const userSignUp = async (req, res, next) => {
  //check errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Convert the errors into an array and return the first error
    const firstError = errors.array()[0];
    return res.status(400).json({ error: firstError.msg });
  }

  try {
    const formData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    if (!formData.username || !formData.email || !formData.password) {
      return res.status(400).send("all fields are required");
    }

    // bcrypt encryption
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    formData.password = hashedPassword;
    console.log(formData);
    const newUser = await createUser(formData);
    //if user has not been created
    if (!newUser) {
      return res
        .status(500)
        .json({ message: "server error:failed to create user try again" });
    }

    // res.redirect("/public/login");
    return res.json(newUser);
  } catch (error) {
    console.log(error);
  }
};

//login Route
const userLogin = async (req, res, next) => {
  //check user input errors
  const errors = validationResult(req);
  //get the first input error thrown
  if (!errors.isEmpty()) {
    const firstError = errors.array[0];
    return res.status(400).json({ error: firstError });
  }

  const formData = { password: req.body.password, email: req.body.email };

  const userObject = await getUser(formData.email);
  console.log("user-email:", formData.password);

  if (!userObject) {
    return res.status(404).json("user not found");
  }

  //check passwords match
  const isPasswordMatch = await bcrypt.compare(
    formData.password,
    userObject.password
  );

  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  sign({ userObject }, secretKey, (err, token) => {
    if (err) {
      return res.status(500).json("failed to generate token");
    }
    console.log(token);
    return res.status(200).json({ token: token, user: userObject });
  });
};

//retrieve the user
const validateSignUp = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .isAlpha()
    .withMessage("Username must contain only alphabetic characters."),

  body("email")
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail(), // Normalizes email format

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

const verifyToken = (req, res, next) => {
  try {
    //get the auth header
    const bearerHeader = req.headers.authorization;
    //extract token from bearerHeader
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      // verify the  token and retrieve the userobject
      verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        //set the req.user to the user from payload
        req.user = decoded.userObject; //the name of the user object must be same as name in payload
        console.log("verr user:", req.user);
        next();
      });
    }
  } catch (error) {
    console.log("token verification error:", error);
  }
};

// get all posts
const allPosts = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    if (!posts) {
      return res.status(404).json({ message: "posts not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

const postById = async (req, res, next) => {
  try {
    const postid = Number(req.params.postid);
    const post = await getSinglePost(postid);
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "post notdfddfdd found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};
const makeComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const postId = req.params.postid;
    const userId = req.user._id;

    // Validate required fields
    if (!comment || !postId || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID format." });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const formData = { comment, postId, userId };
    console.log("New comment:", formData);

    // Create comment
    const newComment = await addComment(formData);
    return res.status(201).json(newComment);
  } catch (error) {
    console.error("Error making comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const postId = req.params.postid;
    const commentId = req.params.commentId;
    const formData = { postId: postId, commentId: commentId };
    const comment = await wipeComment(formData);
    if (!post) {
      return res.status(404).json({ message: "no post" });
    }
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (req, res) => {
  try {
    console.log("bodyyyy", req.body);
    console.log("file", req.file);
    const { postid } = req.params;
    const { content, title } = req.body;
    const userId = req.user._id;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postid)) {
      return res.status(400).json({ error: "Invalid post ID." });
    }

    // Find the post
    const post = await Post.findOne({ _id: postid, author: userId }).select(
      "imageUrl filename"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Prepare update data
    const updateData = { postContent: content, title: title };

    // Handle file upload
    if (req.file) {
      // Validate file type
      const fileType = req.file.mimetype;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        return res.status(400).json({ error: "Invalid file type." });
      }

      // Delete old image from Cloudinary if it exists
      if (post.filename) {
        try {
          await cloudinary.uploader.destroy(post.filename);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image to Cloudinary
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: process.env.foldername || "default-folder" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        updateData.imageUrl = uploadResult.secure_url;
        updateData.filename = uploadResult.public_id;
        updateData.imageSize = req.file.size;
      } catch (uploadError) {
        return res.status(500).json({ error: "Image upload failed." });
      }
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(postid, updateData, {
      new: true,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in updatePost:", error);
    return res.status(500).json({ error: "Error updating post." });
  }
};

//post will delete only if the user is the one who made it

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postid;
    const authorId = req.user._id;

    console.log(postId, "user id:", authorId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID format." });
    }

    if (!postId || !authorId) {
      return res.status(404).json({ message: "Post not found." });
    }

    const deletedPost = await erasePost(postId, authorId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post could not be deleted." });
    }

    return res.status(200).json(deletedPost);
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const newPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileType = req.file.mimetype;
    if (!["image/jpeg", "image/png"].includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type." });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: process.env.foldername },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const formData = {
      author: req.user._id, // Assuming the user is authenticated and `req.user._id` exists
      title: req.body.title,
      postContent: req.body.content, // Correct field mapping
      private: req.body.isPrivate === "true",
      imageUrl: uploadResult.secure_url,
      filename: uploadResult.public_id,
      imageSize: req.file.size,
    };

    const post = await addPost(formData);

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error in newPost:", error);
    return res.status(500).json({ error: "Error creating post." });
  }
};

const findUser = async (req, res, next) => {
  try {
    const userObj = req.user;
    const user = await getUser(userObj.email);
    if (!user) {
      res.statu(500).json("no user found");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const postId = req.params.postid;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID format." });
    }

    const comments = await allComments(postId);
    console.log("Post ID:", postId, "Comments:", comments);

    if (!comments) {
      return res.status(404).json({ message: "Comments not found." });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await specPost(userId);

    if (!posts) {
      return res.status(404).json({ message: "posts not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export {
  validateSignUp,
  validateLogin,
  userSignUp,
  newPost,
  deletePost,
  updatePost,
  userLogin,
  verifyToken,
  allPosts,
  postById,
  upload,
  deleteComment,
  getComments,
  makeComment,
  findUser,
  getMyPosts,
};
