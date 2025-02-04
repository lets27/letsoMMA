import { Router } from "express";
import {
  allPosts,
  deleteComment,
  deletePost,
  makeComment,
  newPost,
  postById,
  verifyToken,
  updatePost,
  upload,
  findUser,
  getComments,
  getMyPosts,
} from "../controllers/controller.js";

const privateUsers = Router();
privateUsers.use(verifyToken);
privateUsers.get("/posts", allPosts);
privateUsers.get("/user", findUser);
privateUsers.get("/comments/:postid", getComments);
privateUsers.get("/blogs", getMyPosts);
privateUsers.post("/post/:postid", makeComment);
privateUsers.delete("/post/:postid/:commentid", deleteComment);
privateUsers.get("/post/:postid", postById);
privateUsers.post("/newpost", upload.single("file"), newPost);
privateUsers.delete("/post/:postid", deletePost);
privateUsers.put("/post/:postid", upload.single("file"), updatePost);

export default privateUsers;
