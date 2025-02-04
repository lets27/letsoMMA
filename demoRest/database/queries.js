import RegularUser from "./models/regUser.js";
import Post from "./models/postModel.js";
import Comment from "./models/commentModel.js";

const createUser = async (formData) => {
  try {
    const newUser = await RegularUser.create(formData);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const getUser = async (email) => {
  try {
    return await RegularUser.findOne({ email });
  } catch (error) {
    console.error("Error retrieving user:", error);
  }
};

const getSinglePost = async (postId) => {
  try {
    return await Post.findById(postId).populate("author").populate("comments");
  } catch (error) {
    console.error("Error retrieving post:", error);
  }
};

const erasePost = async (postId, authorId) => {
  try {
    return await Post.findOneAndDelete({ _id: postId, author: authorId });
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

const getAllPosts = async () => {
  try {
    return await Post.find({ private: false })
      .select("postContent createdAt imageUrl private title author")
      .populate("author", "username");
  } catch (error) {
    console.error("Error retrieving all posts:", error);
  }
};

const addPost = async (formData) => {
  try {
    return await Post.create(formData);
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not add post to the database.");
  }
};

const editPost = async (updateData) => {
  try {
    const { postId, authorId, ...updatedFields } = updateData;
    return await Post.findOneAndUpdate(
      { _id: postId, author: authorId },
      updatedFields,
      { new: true }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Error updating post");
  }
};

const specPost = async (userId) => {
  try {
    return await Post.find({ author: userId });
  } catch (error) {
    console.error("Error retrieving specific user posts:", error);
  }
};

const addComment = async (formData) => {
  try {
    const { userId, postId, comment } = formData;
    const newComment = await Comment.create({
      content: comment,
      user: userId,
      post: postId,
    });

    // Push the comment ID to the post
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

const allComments = async (postId) => {
  try {
    return await Comment.find({ post: postId }).populate("user", "username");
  } catch (error) {
    console.error("Error retrieving comments:", error);
  }
};

const wipeComment = async ({ commentId }) => {
  try {
    return await Comment.findByIdAndDelete(commentId);
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

const getImage = async (postId) => {
  try {
    const post = await Post.findById(postId).select(
      "imageUrl imageSize filename"
    );
    return post;
  } catch (error) {
    console.error("Error retrieving image:", error);
    throw new Error("Could not retrieve image from the database.");
  }
};

export {
  createUser,
  getImage,
  addPost,
  erasePost,
  wipeComment,
  addComment,
  getUser,
  allComments,
  getAllPosts,
  editPost,
  getSinglePost,
  specPost,
};
