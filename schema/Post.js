const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  file_id: { type: String, unique: true, required: true },
  url: { type: String, unique: true, required: true },
  extension_type: { type: String, unique: false, required: true },
});

const Post = new Schema({
  author_id: { type: String, unique: false, required: true },
  title: { type: String, min: 1, max: 30, unique: false, required: true },
  description: {
    type: String,
    min: 1,
    max: 300,
    unique: false,
    required: true,
  },
  likes: { type: Number, unique: false, required: true },
  dislikes: { type: Number, unique: false, required: true },
  media: [mediaSchema],
  release_date: { type: Date, unique: false, required: true },
});

module.exports = mongoose.model("Post", Post);
