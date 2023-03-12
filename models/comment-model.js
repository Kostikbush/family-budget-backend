const { Schema, model } = require("mongoose");

const CommentShema = new Schema({
  email: { type: String, unique: true, required: true },
  comment: { type: String, required: true },
  name: { type: String, required: true },
  smile: { type: String, required: true },
});

module.exports = model("Comment", CommentShema);
