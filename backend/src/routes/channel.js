import { Router } from "express";
import { authenticateJwtToken } from "../middleware/authMiddleware.js";
import { userIsAdmin } from '../middleware/adminMiddleware.js';
import {channelController} from "../controllers/channel.js";

const channel = Router();

//const channelObject = models.Channel;

channel.get("/:channelName", channelController.showChannel);
channel.get("/:channelName/posts", channelController.getAllPosts);
channel.get("/", channelController.showAllChannels);
channel.post("/", authenticateJwtToken, channelController.createAChannel);
channel.put("/:channelName", authenticateJwtToken, channelController.updateOneChannel);
channel.delete("/:channelName", authenticateJwtToken, channelController.deleteChannel);

export default channel;
