const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../schema/User");
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await User.findOne({
      username: username.toLowerCase(),
    });
    console.log("LOG 2");

    if (!user) {
      return done({ message: "No account with this username exists!" }, false);
      //   return res
      //     .status(400)
      //     .send({ message: "No account with this username exists!" });
    }
    console.log("LOG 3");

    return done(null, {
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
      liked_posts: user.liked_posts,
      disliked_posts: user.disliked_posts,
    });
  } catch (message) {
    console.log("LOG 4");

    return done({ message: "No account with this username exists!" }, false);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("LOG 5");

      if (!username || !password) {
        return done({ message: "Empty Fields!" }, false);
        // return res.status(400).send({ message: "Empty Fields!" });
      }

      console.log("LOG 6");

      const user = await User.findOne({
        username: username.toLowerCase(),
      });
      console.log("LOG 7");

      if (!user) {
        console.log("LOG 8");

        return done(
          { message: "No account with this username exists!" },
          false,
        );
        // return res
        //   .status(400)
        //   .send({ message: "No account with this username exists!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("LOG 9");

      if (!isMatch) {
        console.log("LOG 10");

        return done({ message: "Invalid Password!" }, false);
        // return res.status(400).send({ message: "Invalid Password!" });
      }
      console.log("LOG 11");

      return done(null, {
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
        liked_posts: user.liked_posts,
        disliked_posts: user.disliked_posts,
      });

      //   if (req.session.isAuth) {
      //     return res.json(req.session);
      //   } else {
      //     if (await bcrypt.compare(reqUser.password, user.password)) {
      //       let user = {
      //         username: user.username,
      //         displayName: user.displayName,
      //         email: user.email,
      //         biography: user.biography,
      //         followers: user.followers,
      //         following: user.following,
      //         viewers: user.viewers,
      //         profile_image: user.profile_image,
      //         pronouns: user.pronouns,
      //         posts: user.posts,
      //         liked_posts: user.liked_posts,
      //         disliked_posts: user.disliked_posts,
      //       };

      //       res.status(200).send(req.session);
      //     } else {
      //       return res.status(400).send({ message: "Invalid Password!" });
      //     }
      //   }
    } catch (message) {
      console.log(message);

      return done(message, false);
      //   res.status(500).send({ message: message.message });
    }
  }),
);
