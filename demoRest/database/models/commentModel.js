import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegularUser",
      default: null,
    }, // References RegularUser collection
    content: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null }, // References Post collection
  },
  { timestamps: true }
);
//create the comment collection
const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
