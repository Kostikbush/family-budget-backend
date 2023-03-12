const { Schema, model } = require("mongoose");

const ChatModel = new Schema({
  messages: [
    {
      isRead: { type: Boolean, required: true },
      message: { type: String, required: true },
      user: { type: String, required: true },
      date: {
        day: { type: Number, required: true },
        mounth: { type: Number, required: true },
        year: { type: Number, required: true },
      },
    },
  ],
});

module.exports = model("Chat", ChatModel);
