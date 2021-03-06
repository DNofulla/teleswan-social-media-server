const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT | 8080;
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoute = require("./routes/User");
const postsRoute = require("./routes/Post");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
require("./strategies/local");

mongoose.connect(
  process.env.MONGO_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (error) => {
    if (error) {
      throw error;
    }
    console.log(`Connected to MongoDB Database!`);
  },
);

const store = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_STRING,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 14,
});
store.on("error", (error) => console.log(error));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());

app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      // maxAge: 1 * 365 * 24 * 60 * 60 * 1000, // 1 Year
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Days
    },
    saveUninitialized: false,
    resave: false,
    store,
  }),
);

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization", "Origin", "Content-Type", "Accept"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  console.log(req.user);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the TeleSwan Back End REST API!",
  });
});

app.use("/users", usersRoute);
app.use("/posts", postsRoute);

app.listen(port, () => {
  console.log(`TeleSwan Back End Server running at Port ${port}!`);
});
