const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const passport = require("passport");
const access = require("../configure/access");
const generateToken = require("../configure/generateToken");

//@route GET
//@desc get all users
//@access public

const UserController = {};

UserController.findAll = async (req, res) => {
  const users = await User.find().select("-password").select("-email");
  res.json({ users });
};

//@route GET
//@desc get one user by id
//@access public

UserController.userProfile = async (req, res) => {
  try {
    const userId = req.query.userId;

    const books = await Book.find({ user: userId });
    console.log("user books ", books);

    const user = await User.findById(userId);
    res.json({ user: { name: user.name, books } });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

//@route POST
//@desc POST create new user
//@access public
UserController.ADDUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400);

  let user = await User.findOne({ email });
  if (user != null) return res.status(400).json({ msg: "email already used" });

  user = new User({ name, email, password });
  try {
    await user.save();
    const token = generateToken({ id: user.id });
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
UserController.updateUser =
  (passport.authenticate("jwt"),
  async (req, res) => {
    const { id, name, email, password } = req.body;
    const user = await User.findById(id);

    if (user == null) return res.status(401);
    const permision = access.can(req.user.role).updateAny("user");
    if (permision.granted || user.id == req.user.id) {
      user.name = name;
      user.email = email;
      user.password = password;
    }
    try {
      await user.save();
      res.json({ user });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  });

UserController.DeleteUser =
  (passport.authenticate("jwt"),
  async (req, res) => {
    const user = await User.findById(req.body.id);

    const permision = access.can(req.user.role).deleteAny("user");

    console.log("req,user : ", req.user);
    console.log("db user: ", user);

    if (req.user.id == user.id) {
      await user.remove();
      return res.json({ success: true, deletedOwnAcount: true });
    }
    if (permision.granted) {
      await user.remove();
      return res.json({ success: true, deletedOwnAcount: false });
    }
  });

module.exports = UserController;
