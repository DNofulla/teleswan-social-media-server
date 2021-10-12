const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, min: 4, max: 24, unique: true, required: true },
  displayName: { type: String, min: 4, max: 24, required: true },
  biography: { type: String, min: 0, max: 200, unique: false, required: false },
  followers: [
    {
      username: { type: String, min: 4, max: 24, required: true },
    },
  ],
  following: [
    {
      username: { type: String, min: 4, max: 24, required: true },
    },
  ],
  viewers: [
    {
      username: { type: String, min: 4, max: 24, required: true },
    },
  ],
  profile_image: {
    image_id: { type: String, unique: true, required: false },
    url: { type: String, unique: true, required: false },
    extension_type: { type: String, unique: false, required: true },
  },
  pronouns: [
    {
      pronoun: { type: String, unique: false, required: false },
    },
  ],
  posts: [
    {
      post_id: { type: String, unique: true, required: false },
    },
  ],
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", User);
