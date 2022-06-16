import { Router } from "express";
import { authenticateJwtToken } from "../middleware/authMiddleware.js"
import { messageController } from "../controllers/message.js";

const messageRouter = Router();

messageRouter.post("/", authenticateJwtToken, messageController.sendMessage);

messageRouter.get("/:messageId", authenticateJwtToken, messageController.showMessage);


// valid queries -> "/messages" | "/messages?show=sent" | "/messages?show=received" | "/messages?show=all" 
// default for "/messages" -> "/messages?show=received"
messageRouter.get("/", authenticateJwtToken, messageController.showMessages)

export default messageRouter;
