import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/comment.js";

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// @desc		Create a new post
// @route		/api/posts
// @access		Private
export const createPost = async (req, res) => {
  try {
    const { description, picturePath } = req.body;
    if (picturePath.length === 0) {
      return res.status(400).json({ msg: "Please add photo(s)" });
    }

    const newPost = new Post({
      user: req.user._id,
      description,
      picturePath,
    });

    await newPost.save();

    res.json({
      msg: "Post created successfully.",
      newPost: {
        ...newPost._doc,
        user: req.user,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { description, picturePath } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        description,
        picturePath,
      }
    )
      .populate("User likes", "picturePath firstName lastName")
      .populate({
        path: "comments",
        populate: {
          path: "user likes ",
          select: "-password",
        },
      });

    res.json({
      msg: "Post updated successfully.",
      newPost: {
        ...post._doc,
        description,
        picturePath,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
          .populate("User likes", "picturePath firstName lastName followers")
          .populate({
            path: "comments",
            populate: {
              path: "user likes ",
              select: "-password",
            },
          });
  
        if (!post) {
          return res.status(400).json({ msg: "Post does not exist." });
        }
  
        res.json({ post });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
};

export const getFeedPosts = async (req, res) => {
  try {
    const features = new APIfeatures(
      Post.find({
        user: [...req.user.following, req.user._id],
      }),
      req.query
    ).paginating();
    const posts = await features.query
      .sort("-createdAt")
      .populate("User likes", "picturePath firstName lastName followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes ",
          select: "-password",
        },
      });

    res.json({
      msg: "Success",
      result: posts.length,
      posts,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const features = new APIfeatures(
      Post.find({ user: req.params.id }),
      req.query
    ).paginating();
    const posts = await features.query.sort("-createdAt");

    res.json({
      posts,
      result: posts.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.find({
      _id: req.params.id,
      likes: req.user._id,
    });
    if (post.length > 0) {
      return res.status(400).json({ msg: "You have already liked this post" });
    }

    const like = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!like) {
      return res.status(400).json({ msg: "Post does not exist." });
    }

    res.json({ msg: "Post liked successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const like = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!like) {
      return res.status(400).json({ msg: "Post does not exist." });
    }

    res.json({ msg: "Post unliked successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getPostDiscover = async (req, res) => {
  try {
    const newArr = [...req.user.following, req.user._id];

    const num = req.query.num || 8;

    const posts = await Post.aggregate([
      { $match: { user: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
    ]);

    res.json({
      msg: "Success",
      result: posts.length,
      posts,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    await Comment.deleteMany({ _id: { $in: post.comments } });

    res.json({
      msg: "Post deleted successfully.",
      newPost: {
        ...post,
        user: req.user,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    const post = await Post.find({
      _id: req.params.id,
      reports: req.user._id,
    });
    if (post.length > 0) {
      return res
        .status(400)
        .json({ msg: "You have already reported this post" });
    }

    const report = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { reports: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!report) {
      return res.status(400).json({ msg: "Post does not exist." });
    }

    res.json({ msg: "Post reported successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const user = await User.find({
      _id: req.user._id,
      saved: req.params.id,
    });
    if (user.length > 0) {
      return res.status(400).json({ msg: "You have already saved this post." });
    }

    const save = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { saved: req.params.id },
      },
      {
        new: true,
      }
    );

    if (!save) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    res.json({ msg: "Post saved successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const unsavePost = async (req, res) => {
  try {
    const save = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { saved: req.params.id },
      },
      {
        new: true,
      }
    );

    if (!save) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    res.json({ msg: "Post removed from collection successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const features = new APIfeatures(
      Post.find({ _id: { $in: req.user.saved } }),
      req.query
    ).paginating();

    const savePosts = await features.query.sort("-createdAt");

    res.json({
      savePosts,
      result: savePosts.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
