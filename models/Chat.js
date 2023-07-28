import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    recipients: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
