import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Name is a required field"],
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
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
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
  

const User = mongoose.model("User", UserSchema);
export default User;