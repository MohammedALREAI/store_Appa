const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  app.use(require("morgan")("tiny"));
}
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const Book = require("./models/Book");
const User = require("./models/User");
const passport = require("passport");
const setUser = require("./middleware/setUser");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors());

// routes
const routes = require("./Routes/index");

// db
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("error"));
db.once("open", () => console.log("connected"));

app.get("/allbooks", setUser, async (req, res) => {
  let allbooks;
  let user;
  try {
    allbooks = await Book.find();
    user = req.user ? await User.findById(req.user.id) : null;
    res.json({ books: allbooks, user });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});
app.use("/files", express.static(__dirname + "/uploads"));
app.use("/v1", routes);
// // in development
// if (process.env.NODE_ENV !== 'production') {
//     app.use('/', express.static(__dirname + '/client/build'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

// in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port, () => console.log("connected"));
