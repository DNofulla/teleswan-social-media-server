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

const store = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_STRING,
  collection: "sessions",
});
store.on("error", (error) => console.log(error));

app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1 * 365 * 24 * 60 * 60 * 1000, // 1 Year
      httpOnly: true,
    },
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

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
  }
);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Authorization", "Origin", "Content-Type", "Accept"],
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

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
