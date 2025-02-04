import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    postContent: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // References Comment collection
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegularUser",
      required: true,
    }, // References RegularUser collection
    private: { type: Boolean, default: false },
    filename: { type: String, default: null },
    imageUrl: { type: String, default: null },
    imageSize: { type: Number, default: null },
  },
  { timestamps: true }
);
//create the Post collection
const Post = mongoose.model("Post", PostSchema);
export default Post;
