const ChatModel = require("../models/chat-model");
const UserModel = require("../models/user-model");
const types = require("../typesOfWSReq/types");

class ChatService {
  async getChatById(id, ws) {
    const chat = await ChatModel.findOne({ _id: id });
    if (!chat) {
      ws.send(
        JSON.stringify({
          type: types.ERROR,
          value: "Чат не найден",
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          type: types.GET_CHAT,
          value: chat.messages,
        })
      );
    }
  }
  async addMessage(idChat, value, idUser, ws) {
    const chat = await ChatModel.findOne({ _id: idChat });
    if (!chat) {
      ws.send(
        JSON.stringify({
          type: types.ERROR,
          value: "Чат не найден",
        })
      );
    } else {
      const date = new Date();
      const savedMessage = {
        isRead: false,
        message: value,
        user: idUser,
        date: {
          year: date.getFullYear(),
          mounth: date.getMonth(),
          day: date.getDate(),
        },
      };
      chat.messages = [savedMessage, ...chat.messages];
      const oponent = (await UserModel.find({ chat: idChat })).filter(
        (user) => user.email !== idUser
      )[0];
      if (oponent && oponent.ws !== null && oponent.ws !== undefined) {
        oponent.ws.send(
          JSON.stringify({
            type: types.NEW_CHAT,
            value: chat.messages,
          })
        );
      }
      ws.send(
        JSON.stringify({
          type: types.NEW_CHAT,
          value: chat.messages,
        })
      );
      await chat.save();
    }
  }
  async deleteMessage(idChat, value, idUser, ws) {
    const chat = await ChatModel.findOne({ _id: idChat });
    if (!chat) {
      ws.send(
        JSON.stringify({
          type: types.ERROR,
          value: "Чат не найден",
        })
      );
    } else {
      chat.messages.filter((messag) => messag._id !== value);
      const oponent = (await UserModel.find({ chat: idChat })).filter(
        (user) => user.email !== idUser
      )[0];
      if (oponent && oponent.ws !== null && oponent.ws !== undefined) {
        oponent.ws.send(
          JSON.stringify({
            type: types.NEW_CHAT,
            value: chat.messages,
          })
        );
      }
      ws.send(
        JSON.stringify({
          type: types.NEW_CHAT,
          value: chat.messages,
        })
      );
      await chat.save();
    }
  }
  async startChat(idChat, idUser, ws) {
    const user = await UserModel.findOne({ email: idUser });
    const chat = await ChatModel.findOne({ _id: idChat });
    if (!user) {
      ws.send(
        JSON.stringify({
          type: types.ERROR,
          value: "Пользователь не найден",
        })
      );
    } else if (!chat) {
      ws.send(
        JSON.stringify({
          type: types.ERROR,
          value: "Чат не найден",
        })
      );
    } else {
      user.ws = ws;
      await user.save();
      ws.send(
        JSON.stringify({
          type: typeOfWSReq.GET_CHAT,
          value: chat.messages,
        })
      );
    }
  }
  async closeChat(idUser, idChat) {
    const user = await UserModel.findOne({ email: idUser });
    const oponent = (await UserModel.find({ chat: idChat })).filter(
      (user) => user.email !== idUser
    )[0];
    if (
      oponent &&
      "ws" in oponent &&
      oponent.ws !== null &&
      oponent.ws !== undefined
    ) {
      oponent.ws.send(
        JSON.stringify({
          type: types.END_WRITING,
          value: null,
        })
      );
    }
    user.ws = null;
    await user.save();
  }
  async startWrit(redyMessage, idChat, idUser) {
    const oponent = (await UserModel.find({ chat: idChat })).filter(
      (user) => user.email !== idUser
    )[0];
    if (oponent && oponent.ws !== null && oponent.ws !== undefined) {
      oponent.ws.send(JSON.stringify(redyMessage));
    }
  }
  async endWrit(redyMessage, idChat, idUser) {
    const oponent = (await UserModel.find({ chat: idChat })).filter(
      (user) => user.email !== idUser
    )[0];
    if (oponent && oponent.ws !== null && oponent.ws !== undefined) {
      oponent.ws.send(JSON.stringify(redyMessage));
    }
  }
  async changeMessage(idChat, idUser, value, ws) {
    const chat = await ChatModel.findOne({ _id: idChat });
    const oponent = (await UserModel.find({ chat: idChat })).filter(
      (user) => user.email !== idUser
    )[0];
    chat.messages.map((messag) => {
      if (messag._id === value.id) {
        return { ...messag, message: value.newMessage };
      }
      return messag;
    });
    if (oponent && oponent.ws !== null && oponent.ws !== undefined) {
      oponent.ws.send(
        JSON.stringify({
          type: types.NEW_CHAT,
          value: chat.messages,
        })
      );
    }
    await chat.save();
    ws.send(
      JSON.stringify({
        type: types.NEW_CHAT,
        value: chat.messages,
      })
    );
  }
}

module.exports = new ChatService();
