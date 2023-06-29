import { messagesModel } from "../../models/messages.model.js";

export class MessageManager {
  async getMessages() {
    try {
      const messages = await messagesModel.find();
      return messages;
    } catch (error) {
      return error;
    }
  }
  async savedMessages(newMessage) {
    try {
      await messagesModel.create(newMessage);
      return this.getMessages();
    } catch (error) {
      return error;
    }
  }
  async cleanHisotry() {
    try {
      await messagesModel.deleteMany();
      return this.getMessages();
    } catch (error) {
      return error;
    }
  }
}
