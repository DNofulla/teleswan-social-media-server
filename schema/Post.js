const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
  posterid: { type: String, unique: false, required: true },
  title: { type: String, min: 4, max: 30, unique: false, required: true },
  description: { type: String, min: 4, max: 30, unique: false, required: true },
  likes: { type: Number, unique: false, required: true },
  dislikes: { type: Number, unique: false, required: true },
  media: [
    {
      file_id: { type: String, unique: true, required: false },
      url: { type: String, unique: true, required: false },
      extension_type: { type: String, unique: false, required: true },
    },
  ],
  release_date: { type: Date, unique: false, required: true },
});

module.exports = mongoose.model("Post", Post);
