const { Schema, model } = require("mongoose");

const UserShema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  budget: { type: Schema.Types.ObjectId || null, ref: "Budget" },
  avatar: { type: String, default: "" },
  isSetComment: { type: Boolean, required: true, default: false },
  alert: [
    {
      id: { type: String, required: true },
      userFrom: { type: String, required: true },
      userTo: { type: String, required: true },
      theme: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
  chat: { type: Schema.Types.ObjectId || null, ref: "Chat" },
  ws: { type: Object || null || undefined, default: null },
});

module.exports = model("User", UserShema);
