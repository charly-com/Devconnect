import Chat from "../models/Chat.js";
import Messages from "../models/Message.js";

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

export const createMessage = async (req, res) => {
  try {
    const { recipient, text, media } = req.body;
    if (!recipient || (!text.trim() && media.length === 0)) return;

    const newConversation = await Chat.findOneAndUpdate(
      {
        $or: [
          { recipients: [req.user._id, recipient] },
          { recipients: [recipient, req.user._id] },
        ],
      },
      {
        recipients: [req.user._id, recipient],
        text,
        media,
      },
      { new: true, upsert: true }
    );

    const newMessage = new Messages({
      chat: newConversation._id,
      sender: req.user._id,
      recipient,
      text,
      media,
    });

    await newMessage.save();

    res.json({ msg: "Created." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const features = new APIfeatures(
      Chat.find({
        recipients: req.user._id,
      }),
      req.query
    ).paginating();

    const conversations = await features.query
      .sort("-updatedAt")
      .populate("recipients", "picturePath firstName lastName");

    res.json({
      conversations,
      result: conversations.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const features = new APIfeatures(
      Messages.find({
        $or: [
          { sender: req.user._id, recipient: req.params.id },
          { sender: req.params.id, recipient: req.user._id },
        ],
      }),
      req.query
    ).paginating();

    const messages = await features.query.sort("-createdAt");

    res.json({
      messages,
      result: messages.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
