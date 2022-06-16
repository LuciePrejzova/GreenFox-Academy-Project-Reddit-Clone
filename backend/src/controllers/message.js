import 'regenerator-runtime/runtime.js'
import { messageService } from "../services/message.js";

class MessageController {
  constructor(messageService, userService) {
    this.messageService = messageService;
    this.userService = userService;
  }

  async showMessage(req, res) {
    messageService.showMessageById(req, res);
  };

  async sendMessage(req, res) {
    messageService.sendMessageToOtherUser(req, res);
  };

  async showMessages(req, res) {
    const serviceResponse = await messageService.listMessagesForLoggedUser(req);
    res.send(serviceResponse);
  }
}

const messageController = new MessageController();
export { messageController, MessageController }
