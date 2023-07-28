import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
  {
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default:
        "https://res.cloudinary.com/dfcaehp0b/image/upload/v1650481698/vd6bg6se3kbqutrd4cn1.png",
    },
    mobile: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Post'
      }
    ],
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  
  },
  { timestamps: true }
);
UserSchema.methods.matchPassword = async function (givenPass) {
    return await bcrypt.compare(givenPass, this.password);
  };
  UserSchema.pre("save", async function hashPassword(next) {
    if (!this.isModified) {
      next();
    }
    //   ? hash the password
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  });
  
  // UserSchema.set("model", Notification);
const User = mongoose.model("User", UserSchema);
export default User;