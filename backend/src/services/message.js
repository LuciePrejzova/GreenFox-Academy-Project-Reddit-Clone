import { Sequelize } from "sequelize";
import models from "../models/index.js";
import { userService } from "./user.js";
import { validationUtils } from "../utils/validationUtils.js"
const { Message } = models;

class MessageService {
  constructor(userService) {
    this.userService = userService;
  }

  async createMessage(req) {
    let recipient = await userService.findByUserName(req.body.username);
    let recipientId = recipient.id;
    let senderId = req.userId;
    await Message.build({
      subject: req.body.subject,
      content: req.body.content,
      recipient_id: recipientId,
      sender_id: senderId,
    }).save();
  };

  async findMessageById(messageId) {
    let message = await Message.findOne({
      where: { id: messageId }
    });
    return message;
  };

  async findAllMessagesByUserId(userId) {
    let messages = await Message.findAll({
      where: Sequelize.or({ recipient_id: userId }, { sender_id: userId })
    });
    return messages;
  };

  async sendMessageToOtherUser(req, res) {

    // error if subject is missing
    if (!req.body.subject) {
      return res.status(400).send({
        error: "Please provide a subject to your message"
      });
    }

    // error if content is missing
    if (!req.body.content) {
      return res.status(400).send({
        error: "Please provide a content to your message"
      });
    }

    // error if recipient is missing
    if (!req.body.username) {
      return res.status(400).send({
        error: "Please specify a recipient to your message"
      });
    }

    // Check if user recipient exists within database
    let recipient = await userService.findByUserName(req.body.username);

    if (recipient == undefined) {
      return res.status(404).send({
        error: "Recipient not found"
      });
    } else {
      await messageService.createMessage(req);
      return res.status(201).send({
        message: "Message successfully sent and saved"
      });
    }
  };

  async showMessageById(req, res) {

    // error if id isn't a number or if not provided
    if (req.params.messageId == null || !validationUtils.isValidNumber(req.params.messageId)) {
      return res.status(400).send({
        error: "Please provide a valid number"
      });
    }

    // check if message id exists within the database
    let message = await messageService.findMessageById(req.params.messageId);

    if (message == undefined) {
      return res.status(404).send({
        error: "Message not found"
      });
    }

    if (message.recipientId != req.userId && message.sender_id != req.userId) {
      return res.status(401).send({
        error: "Not allowed to see this message"
      });
    } else {
      return res.status(200).send(message);
    }
  };

  // ↓↓↓ "GET /messages" code ↓↓↓
  async listMessagesForLoggedUser(req) {
    const queryArgument = this.getDbQueryArgument(req);
    const dbFetchResult = await this.getMessagesForActiveUser(queryArgument);
    return dbFetchResult;
  }

  // helper function -> provides value for "where" key for Sequelize
  getDbQueryArgument({ query, userId }) {
    const defaultValue = "received";

    // if "/messages?show=<type>" is not specified, it defaults to "?show=received"
    const content = query.show ?? defaultValue;

    // valid query values
    const validQueryArguments = new Map(
      [
        ["sent", { sender_id: userId }],
        ["received", { recipient_id: userId }],
        ["all", Sequelize.or({ recipient_id: userId }, { sender_id: userId })]
      ]
    )

    // if valid query value is provided from a user, returns relevant argument for db fetch
    // if query value is invalid, default argument for db fetch is returned
    return validQueryArguments.get(content) || validQueryArguments.get(defaultValue)
  }

  // db query for GET /messages for logged user
  async getMessagesForActiveUser(queryValue) {
    const messages = await Message.findAll({
      where: queryValue
    });
    return messages;

  }
}
const messageService = new MessageService(userService);
export { messageService, MessageService };