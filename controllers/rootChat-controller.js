const ChatService = require("../servise/chat-service");
const typeOfWSReq = require("../typesOfWSReq/types");
class RootChatController {
  async controllReq(message, ws, req) {
    try {
      const { idChat, idUser } = req.params;
      const redyMessage = JSON.parse(message);
      switch (redyMessage.type) {
        case typeOfWSReq.ADD_MESSAGE:
          await ChatService.addMessage(idChat, redyMessage.value, idUser, ws);
        case typeOfWSReq.DELETE_MESSAGE:
          await ChatService.deleteMessage(
            idChat,
            redyMessage.value,
            idUser,
            ws
          );
        case typeOfWSReq.GET_CHAT:
          await ChatService.getChatById(idChat, ws);
        case typeOfWSReq.START_WRITING:
          await ChatService.startWrit(redyMessage, idChat, idUser);
        case typeOfWSReq.END_WRITING:
          await ChatService.endWrit(redyMessage, idChat, idUser);
        case typeOfWSReq.CHANGE_MESSAGE:
          await ChatService.changeMessage(
            idChat,
            idUser,
            redyMessage.value,
            ws
          );
        case typeOfWSReq.READ_MESSAGE:
      }
    } catch (e) {
      console.log(e);
    }
  }
  async startChat(ws, req) {
    try {
      const { idChat, idUser } = req.params;
      await ChatService.startChat(idChat, idUser, ws);
    } catch (e) {
      console.log(e);
    }
  }
  async closeChat(req) {
    try {
      const { idUser, idChat } = req.params;
      await ChatService.closeChat(idUser, idChat);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new RootChatController();
