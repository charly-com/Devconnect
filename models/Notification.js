import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        
      },
      recipients: [mongoose.Types.ObjectId],
      url: String,
      text: String,
      content: String,
      image: String,
      isRead: {type:Boolean, default: false}
  
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", NotificationSchema);

