import express from "express";
import { authentication } from "../middleware/auth.js";
import {
  getMessages,
  getUserForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authentication, getUserForSidebar);
messageRouter.get("/:id", authentication, getMessages);
messageRouter.put("/mark/:id", authentication, markMessageAsSeen);
messageRouter.post("/send/:id", authentication, sendMessage);

export default messageRouter;
