import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;

    const user_email = await User.findOne({ email });
    if (user_email) {
      return res.status(400).json({ msg: "This email is already registered." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const access_token = createAccessToken({ id: newUser._id });
    const refresh_token = createRefreshToken({ id: newUser._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
    });

    res.json({
      msg: "Registered Successfully!",
      access_token,
      user: {
        ...newUser._doc,
        password: "",
      },
    });

    await newUser.save();

    res.json({ msg: "registered" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ _id: req.user._id });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Your password is wrong." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long." });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { password: newPasswordHash }
    );

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, role } = req.body;

    const user_email = await User.findOne({ email });
    if (user_email) {
      return res.status(400).json({ msg: "This email is already registered." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
      role,
    });

    await newUser.save();

    res.json({ msg: "Admin Registered Successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "user" }).populate(
      "followers following",
      "-password"
    );

    if (!user) {
      return res.status(400).json({ msg: "Email or Password is incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Email or Password is incorrect." });
    }

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
    });

    res.json({
      msg: "Logged in  Successfully!",
      access_token,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "admin" });

    if (!user) {
      return res.status(400).json({ msg: "Email or Password is incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Email or Password is incorrect." });
    }

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
    });

    res.json({
      msg: "Logged in  Successfully!",
      access_token,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.json({ msg: "Logged out Successfully." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const generateAccessToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;

    if (!rf_token) {
      return res.status(400).json({ msg: "Please login again." });
    }
    jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "Please login again." });
        }

        const user = await User.findById(result.id)
          .select("-password")
          .populate("followers following", "-password");

        if (!user) {
          return res.status(400).json({ msg: "User does not exist." });
        }

        const access_token = createAccessToken({ id: result.id });
        res.json({ access_token, user });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
