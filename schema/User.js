const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pronounSchema = new Schema({
  pronoun: { type: String, unique: false, required: false },
});

const ffvSchema = new Schema({
  username: { type: String, min: 4, max: 24, required: true },
});

const profileImageSchema = new Schema({
  image_id: { type: String, unique: true, required: false },
  url: { type: String, unique: true, required: false },
  extension_type: { type: String, unique: false, required: true },
});

const postIdSchema = new Schema({
  post_id: { type: String, unique: true, required: true },
});

const User = new Schema({
  username: { type: String, min: 4, max: 24, unique: true, required: true },
  displayName: { type: String, min: 4, max: 24, required: true },
  biography: { type: String, min: 0, max: 200, unique: false, required: false },
  followers: [ffvSchema],
  following: [ffvSchema],
  viewers: [ffvSchema],
  profile_image: profileImageSchema,
  pronouns: [pronounSchema],
  posts: [postIdSchema],
  email: { type: String, unique: true, required: true },
  liked_posts: [postIdSchema],
  disliked_posts: [postIdSchema],
  password: { type: String, min: 8, max: 24, required: true },
});

module.exports = mongoose.model("User", User);
