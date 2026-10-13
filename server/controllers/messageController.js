import messageModel from "../models/MessageModel.js";
import userModel from "../models/userModel.js";
import { cloudinary } from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch all other users
    const filteredUser = await userModel
      .find({ _id: { $ne: userId } }) // Find users where ID is NOT equal to the current user
      .select("-password"); // Strip out password hashes for security

    // 2. Count unread messages for each user
    const unseenMessages = {};
    const promises = filteredUser.map(async (user) => {
      // Count how many unread messages this specific user sent to the logged-in user
      const count = await messageModel.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    });

    // Wait for all database loops to finish executing
    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      user: filteredUser,
      unseenMessages,
    });
  } catch (error) {
    console.error("getUserForSidebar Controller Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params; // The ID of the friend you clicked on
    const myId = req.user._id; // Your ID (from auth middleware)

    // 1. Fetch the complete chat history between you and this specific user
    // 1. Fetch the complete chat history between you and this specific user
    const messages = await messageModel
      .find({
        $or: [
          { senderId: myId, receiverId: selectedUserId },
          { senderId: selectedUserId, receiverId: myId },
        ],
      })
      .sort({ createdAt: 1 });

    // 2. Mark all unread messages from this friend to you as "seen"
    await messageModel.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } },
    );

    // FIXED: Changed from 'message: messages' to 'messages: messages' (or shorthand 'messages')
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("getMessages Controller Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params; // The Message ID sent from the frontend
    const myId = req.user._id; // Your ID from the auth middleware

    // 1. Safety Check: Only update if the message belongs to YOU (the receiver)
    // This prevents malicious users from marking other people's messages as read
    const updatedMessage = await messageModel.findOneAndUpdate(
      { _id: id, receiverId: myId, seen: false }, // Only target unread messages meant for you
      { $set: { seen: true } },
      { new: true }, // Returns the updated message
    );

    // 2. If no matching unread message was found for you, return an error
    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        msg: "Message not found or already marked as seen",
      });
    }

    // 3. Return standard 200 Success status code
    return res
      .status(200)
      .json({ success: true, msg: "Message marked as seen" });
  } catch (error) {
    console.error("markMessageAsSeen Controller Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error("sendMessage Controller Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};
