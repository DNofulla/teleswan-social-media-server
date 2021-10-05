const mongoose = require("mongoose");

const Post = new Schema({
  posterid: { type: String, unique: false, required: true },
  title: { type: String, min: 4, max: 30, unique: false, required: true },
  description: { type: String, min: 4, max: 30, unique: false, required: true },
  likes: { type: Number, unique: false, required: true },
  dislikes: { type: Number, unique: false, required: true },
  // Images
  // Gifs
});
