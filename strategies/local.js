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

    if (!user) {
      return done({ message: "No account with this username exists!" }, false);
      //   return res
      //     .status(400)
      //     .send({ message: "No account with this username exists!" });
    }

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
    return done({ message: "No account with this username exists!" }, false);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (!username || !password) {
        return done({ message: "Empty Fields!" }, false);
        // return res.status(400).send({ message: "Empty Fields!" });
      }

      const user = await User.findOne({
        username: username.toLowerCase(),
      });

      if (!user) {
        return done(
          { message: "No account with this username exists!" },
          false,
        );
        // return res
        //   .status(400)
        //   .send({ message: "No account with this username exists!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done({ message: "Invalid Password!" }, false);
        // return res.status(400).send({ message: "Invalid Password!" });
      }

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
