const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  image_id: { type: String, unique: true, required: false },
  url: { type: String, unique: true, required: false },
  extension_type: { type: String, unique: false, required: true },
});

const Message = new Schema({
  is_image: { type: Boolean, unique: false, required: true },
  sender_id: { type: String, unique: false, required: true },
  receiver_id: { type: String, unique: false, required: true },
  media: mediaSchema,
  text: { type: String, min: 0, max: 500, unique: false, required: false },
  send_date: { type: Date, unique: false, required: true },
});

module.exports = mongoose.model("Message", Message);
