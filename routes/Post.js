const { Router } = require("express");
const router = Router();
const Post = require("../schema/Post");
const User = require("../schema/User");
const isAuth = require("../util/auth");

// Create post
router.post("/new", isAuth, async (req, res) => {
  try {
    let reqPost = req.body;

    if (!reqPost.title) {
      return res.status(400).send({ message: "Post title is not present!" });
    }

    if (!reqPost.description) {
      return res
        .status(400)
        .send({ message: "Post description is not present" });
    }

    const user = await User.findOne({
      username: req.session.user.username.toLowerCase(),
    });

    const newPost = new Post({
      author_id: user.username.toLowerCase(),
      title: reqPost.title,
      description: reqPost.description,
      likes: 0,
      dislikes: 0,
      media: [],
      release_date: new Date(),
    });

    await newPost.save();

    const updated_user = await User.findOneAndUpdate(
      { username: user.username.toLowerCase() },
      { posts: [...user.posts, newPost._id] },
    );

    // Set Session to updated User without password
    req.session.destroy((err) => {
      if (err) throw err;
      req.session = null;
    });

    req.session.regenerate();

    req.session.isAuth = true;
    req.session.user = {
      username: updated_user.username,
      displayName: updated_user.displayName,
      email: updated_user.email,
      biography: updated_user.biography,
      followers: updated_user.followers,
      following: updated_user.following,
      viewers: updated_user.viewers,
      profile_image: updated_user.profile_image,
      pronouns: updated_user.pronouns,
      posts: updated_user.posts,
      sessionID: updated_user.sessionID,
      liked_posts: updated_user.liked_posts,
      disliked_posts: updated_user.disliked_posts,
    };

    res
      .status(200)
      .send({ message: "Post has been created successfully!", newPost });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Like post by post id
router.patch("/like/:post_id", isAuth, async (req, res) => {
  try {
    let post_id = req.params.post_id;

    if (!post_id) {
      return res
        .status(400)
        .send({ message: "Post ID missing from parameter arguments" });
    }

    let username = req.session.user.username.toLowerCase();

    const user = await User.findOne({ username: username });

    if (user.liked_posts.includes(post_id)) {
      return res.status(200).send({ message: "Post already Liked" });
    } else {
      const post = await Post.findOneAndUpdate(
        { _id: post_id },
        user.disliked_posts.includes(post_id)
          ? { dislikes: post.dislikes - 1, likes: post.likes + 1 }
          : { likes: post.likes + 1 },
      );

      let index_of_post = user.disliked_posts.includes(post_id)
        ? user.disliked_posts.indexOf(post_id)
        : null;

      let new_posts = user.disliked_posts.includes(post_id)
        ? user.disliked_posts.splice(index_of_post, 1)
        : user.disliked_posts;

      const updated_user = await User.findOneAndUpdate(
        { username: user.username.toLowerCase() },
        user.disliked_posts.includes(post_id)
          ? {
              disliked_posts: new_posts,
              liked_posts: [...user.liked_posts, post_id],
            }
          : { liked_posts: [...user.liked_posts, post_id] },
      );

      // Set Session to updated User without password
      req.session.destroy((err) => {
        if (err) throw err;
        req.session = null;
      });

      req.session.regenerate();

      req.session.isAuth = true;
      req.session.user = {
        username: updated_user.username,
        displayName: updated_user.displayName,
        email: updated_user.email,
        biography: updated_user.biography,
        followers: updated_user.followers,
        following: updated_user.following,
        viewers: updated_user.viewers,
        profile_image: updated_user.profile_image,
        pronouns: updated_user.pronouns,
        posts: updated_user.posts,
        sessionID: updated_user.sessionID,
        liked_posts: updated_user.liked_posts,
        disliked_posts: updated_user.disliked_posts,
      };

      return res.status(200).send({ message: "Liked Post!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Dislike post by post id
router.patch("/dislike/:post_id", isAuth, async (req, res) => {
  try {
    let post_id = req.params.post_id;

    if (!post_id) {
      return res
        .status(400)
        .send({ message: "Post ID missing from parameter arguments" });
    }

    let username = req.session.user.username.toLowerCase();

    const user = await User.findOne({ username: username });

    if (user.disliked_posts.includes(post_id)) {
      return res.status(200).send({ message: "Post already Disliked" });
    } else {
      const post = await Post.findOneAndUpdate(
        { _id: post_id },
        user.liked_posts.includes(post_id)
          ? { dislikes: post.dislikes + 1, likes: post.likes - 1 }
          : { dislikes: post.dislikes + 1 },
      );

      let index_of_post = user.liked_posts.includes(post_id)
        ? user.liked_posts.indexOf(post_id)
        : null;

      let new_posts = user.liked_posts.includes(post_id)
        ? user.liked_posts.splice(index_of_post, 1)
        : user.liked_posts;

      const updated_user = await User.findOneAndUpdate(
        { username: user.username.toLowerCase() },
        user.liked_posts.includes(post_id)
          ? {
              liked_posts: new_posts,
              disliked_posts: [...user.disliked_posts, post_id],
            }
          : { disliked_posts: [...user.disliked_posts, post_id] },
      );

      // Set Session to updated User without password
      req.session.destroy((err) => {
        if (err) throw err;
        req.session = null;
      });

      req.session.regenerate();

      req.session.isAuth = true;
      req.session.user = {
        username: updated_user.username,
        displayName: updated_user.displayName,
        email: updated_user.email,
        biography: updated_user.biography,
        followers: updated_user.followers,
        following: updated_user.following,
        viewers: updated_user.viewers,
        profile_image: updated_user.profile_image,
        pronouns: updated_user.pronouns,
        posts: updated_user.posts,
        sessionID: updated_user.sessionID,
        liked_posts: updated_user.liked_posts,
        disliked_posts: updated_user.disliked_posts,
      };

      return res.status(200).send({ message: "Liked Post!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Delete post by post id
router.delete("/delete/:post_id", isAuth, async (req, res) => {
  try {
    let post_id = req.params.post_id;

    if (!post_id) {
      return res
        .status(400)
        .send({ message: "Post ID missing from parameter arguments" });
    }

    let username = req.session.user.username.toLowerCase();

    const user = await User.findOne({ username: username });

    let indexOf = user.posts.includes(post_id)
      ? user.posts.indexOf(post_id)
      : null;

    let posts = user.posts.includes(post_id)
      ? user.posts.splice(indexOf, 1)
      : user.posts;

    await User.findOneAndUpdate({ username: username }, posts);

    // Not the most efficient way, but it works
    for await (const doc_user of User.find()) {
      let liked_index = doc_user.liked_posts.includes(post_id)
        ? user.liked_posts.indexOf(post_id)
        : null;

      let liked_posts = user.liked_posts.includes(post_id)
        ? user.liked_posts.splice(indexOf, 1)
        : user.liked_posts;

      let disliked_index = doc_user.disliked_posts.includes(post_id)
        ? user.disliked_posts.indexOf(post_id)
        : null;

      let disliked_posts = user.disliked_posts.includes(post_id)
        ? user.disliked_posts.splice(indexOf, 1)
        : user.disliked_posts;

      liked_index || disliked_index
        ? await User.updateOne(
            { username: doc_user.username },
            { liked_posts: liked_posts, disliked_posts: disliked_posts },
          )
        : null;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
