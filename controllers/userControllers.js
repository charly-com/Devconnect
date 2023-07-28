import User from "../models/User.js";


  export const searchUser = async (req, res) => {
    try {
      const users = await User.find({
        email: { $regex: req.query.email },
      })
        .limit(10)
        .select("firstName lastName picturePath");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");

      if (!user) {
        return res.status(400).json({ msg: "requested user does not exist." });
      }

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const updateUser = async (req, res) => {
    try {
      const {
        picturePath,
        firstName,
        lastName,
        mobile,
        address,
        
        gender,
      } = req.body;
      if (!firstName || !lastName) {
        return res.status(400).json({ msg: "Please add your full name." });
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { picturePath, firstName, mobile, address,  gender }
      );

      res.json({ msg: "Profile updated successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const follow= async (req, res) => {
    try {
      const user = await User.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res
          .status(500)
          .json({ msg: "You are already following this user." });



      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            followers: req.user._id
          },
        },
        { new: true }
      ).populate("followers following", "-password");

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { following: req.params.id } },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const unfollow = async (req, res) => {
    try {
      

      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id }
        },
        { new: true }
      ).populate('followers following', '-password');

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { following: req.params.id } },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const suggestionsUser = async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;
      const users = await User.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "Users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };






