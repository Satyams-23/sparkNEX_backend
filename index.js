const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const userRouter = require("./Routes/userRouter");
const otpRouter = require("./Routes/otpRoutes");
const customizeRouter = require("./Routes/customizeRouter");
const chatRouter = require("./Routes/chatRouter");
const messageRouter = require("./Routes/messageRouter");
const app = express();
const session = require("express-session");
const passport = require("passport");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.6oxpbun.mongodb.net/SparkNEX?retryWrites=true&w=majority&appName=Cluster0`,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(userRouter);
app.use(otpRouter);
app.use("/api/chat", chatRouter);
app.use("/customize", customizeRouter);
app.use("/message", messageRouter);
const DB = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.6oxpbun.mongodb.net/SparkNEX?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(DB)
  .then(() => console.log("Connect"))
  .catch((error) => {
    console.log("not connected");
  });
app.get("/", (req, res) => {
  res.send("Hello Sparknex!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
