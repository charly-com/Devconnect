import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Types.ObjectId, ref: "User" },
    
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
