import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/comment.js";


  export const getTotalUsers = async (req, res) => {
    try {
      const users = await User.find();
      const total_users = users.length;
      res.json({ total_users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const getTotalPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      const total_posts = posts.length;
      res.json({ total_posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

 export const getTotalComments = async (req, res) => {
    try {
      const comments = await Comment.find();
      const total_comments = comments.length;
      res.json({ total_comments });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

 export const getTotalLikes = async (req, res) => {
    try {
      const posts = await Post.find();
      let total_likes = 0;
      await posts.map((post) => (total_likes += post.likes.length));
      res.json({ total_likes });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const getTotalSpamPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      
      const reportedPosts = await posts.filter(post => post.reports.length>2);
      const total_spam_posts = reportedPosts.length;
      res.json({ total_spam_posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const getSpamPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .select("user createdAt reports content")
        .populate({ path: "user", select: "firstName picturePath email" });
      const spamPosts = posts.filter((post) => post.reports.length > 1);
      
      res.json({ spamPosts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const deleteSpamPost = async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
      });

      await Comment.deleteMany({ _id: { $in: post.comments } });

      res.json({ msg: "Post deleted successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };



