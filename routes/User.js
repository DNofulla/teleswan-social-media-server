const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const User = require("../schema/User");
const isAuth = require("../util/isAuth");

// Finding sessions from mongo store (future use)
// let session = mongoose.connection.db
//   .collection("sessions")
//   .find({ _id: req.session.user.sessionID });

/*
  This endpoint will be removed when the final code of this project is deleted.
  This is for testing purposes only.
*/
router.get("/", async (req, res) => {
  res
    .status(400)
    .send({ message: "INVALID ENDPOINT! DO NOT use this endpoint!" });
}); // localhost:8080/users/

// localhost:8080/users/:username
router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return res
        .status(400)
        .send({ message: "No username sent!", exists: false });
    }

    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res.status(400).send({
        message: "No account with this username exists!",
        exists: false,
      });
    } else {
      return res.status(200).send({
        exists: true,
        user: {
          username: user.username,
        },
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// localhost:8080/users/login
router.post("/login", async (req, res) => {
  try {
    const reqUser = req.body;

    if (!reqUser.username || !reqUser.password) {
      return res.status(400).send({ message: "Empty Fields!" });
    }

    const user = await User.findOne({
      username: reqUser.username.toLowerCase(),
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: "No account with this username exists!" });
    }

    const isMatch = await bcrypt.compare(reqUser.password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Password!" });
    }

    if (req.session.isAuth) {
      return res.json(req.session);
    } else {
      if (await bcrypt.compare(reqUser.password, user.password)) {
        req.session.isAuth = true;
        req.session.user = {
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          biography: user.biography,
          followers: user.followers,
          following: user.following,
          viewers: user.viewers,
          profile_image: user.profile_image,
          pronouns: user.pronouns,
          posts: user.posts,
          sessionID: user.sessionID,
          liked_posts: user.liked_posts,
          disliked_posts: user.disliked_posts,
        };

        res.status(200).send(req.session);
      } else {
        return res.status(400).send({ message: "Invalid Password!" });
      }
    }
  } catch (message) {
    res.status(500).send({ message: message.message });
  }
});

// localhost:8080/users/register
router.post("/register", async (req, res) => {
  try {
    let reqUser = req.body;
    if (!reqUser.username || !reqUser.email || !reqUser.password) {
      return res.status(400).send({ message: "Empty Fields!" });
    }

    if (
      !/^[a-zA-Z0-9._][^~`!@#$%^&*()\-+={}\[ \];:'"<|>,/?]{4,24}$/.test(
        reqUser.username.toLowerCase()
      )
    ) {
      return res.status(400).send({
        message: "Please enter a username 4 to 24 characters long!",
      });
    }

    if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        reqUser.email
      )
    ) {
      return res.status(400).send({ message: "Please enter a valid email!" });
    }

    if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()_\-+={}\[ \];:'"<|>,./?])(?=.*[a-zA-Z]).{8,24}$/.test(
        reqUser.password
      )
    ) {
      return res.status(400).send({
        message:
          "Please enter a password 8 to 24 characters long that contains at least 1 Upper Case letter, 1 Lower Case letter, 1 Number and 1 Special Character!",
      });
    }

    const userExistsUsername = await User.findOne({
      username: reqUser.username.toLowerCase(),
    });
    const userExistsEmail = await User.findOne({ email: reqUser.email });

    if (userExistsUsername) {
      return res
        .status(400)
        .send({ message: "Account with this username already exists." });
    }

    if (userExistsEmail) {
      return res
        .status(400)
        .send({ message: "Account with this email already exists." });
    }

    const bcryptSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(reqUser.password, bcryptSalt);

    const newUser = new User({
      username: reqUser.username.toLowerCase(),
      displayName: reqUser.username,
      email: reqUser.email.toLowerCase(),
      password: hashedPassword,
      biography: "Hello! I am a new TeleSwan User!",
      followers: [],
      following: [],
      viewers: [],
      profile_image: {
        image_id: "default.png",
        url: "default",
        extension_type: "png",
      },
      pronouns: [],
      posts: [],
      liked_posts: [],
      disliked_posts: [],
    });
    await newUser.save();
    res.status(200).send({ message: "Success!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Logging out and destroying session: localhost:8080/users/logout
router.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    req.session = null;
  });

  res.status(200).send({
    message: `User Session has been destroyed!`,
  });
});

router.use(isAuth); // uses authentication middleware for all functions below

router.put("/edit_profile", async (req, res) => {
  try {
    let sessionUser = req.session.user;

    let newUser = req.body.newUser;
    let oldPassword = req.body.oldPassword;

    const userExistsUsername = await User.findOne({
      username: sessionUser.username.toLowerCase(),
    });

    if (!userExistsUsername) {
      return res
        .status(400)
        .send({ message: "Account with this username does not exist." });
    }

    if (!oldPassword) {
      return res
        .status(400)
        .send({ message: "Cannot edit profile without old password" });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      userExistsUsername.password
    );

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Password!" });
    } else {
      const bcryptSalt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newUser.password, bcryptSalt);
      newUser.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: sessionUser.username.toLowerCase() },
      newUser,
      { returnOriginal: false }
    );

    req.session.destroy((err) => {
      if (err) throw err;
      req.session = null;
    });

    req.session.regenerate();

    req.session.isAuth = true;
    req.session.user = {
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      biography: updatedUser.biography,
      followers: updatedUser.followers,
      following: updatedUser.following,
      viewers: updatedUser.viewers,
      profile_image: updatedUser.profile_image,
      pronouns: updatedUser.pronouns,
      posts: updatedUser.posts,
      sessionID: updatedUser.sessionID,
      liked_posts: updatedUser.liked_posts,
      disliked_posts: updatedUser.disliked_posts,
    };

    res.status(200).send(req.session);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
