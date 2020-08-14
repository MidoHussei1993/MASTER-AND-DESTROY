const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//get current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  // .select('-password')

  if (!user) return res.status(400).send({ message: "this is user not found" });

  res.send(user);
});
//return all user
router.get("/", async (req, res) => {
  const users = await User.getUsers().select({ name: 1 });
  // .select({name:1 , email:1});
  res.status(200).send(users);
});
//get user info by his id
router.get("/:id", auth, async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid user id..` });
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(400).send({ message: "can`t find user with this id " });
  res.status(200).send(user);
});
//to create new user
router.post("/", async (req, res) => {
  const image = req.file;
  if(!image) return res.status(401).send({message:'you should upload file'})
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // res.send('work')
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.merge(_.pick(req.body, ["name", "email", "password", "jobTitle", "joinDate"]) , {image:image.path})
  );
  // user.image
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.status(200).send(token);
});
//to login and return token
router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: "User not Found" });
  const isValidUser = await bcrypt.compare(req.body.password , user.password)
  if(!isValidUser)return res.status(401).send({message:'invalid user check you email and password'})
  const token = user.generateAuthToken();
  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  res.status(200).send(token);
});

module.exports = router;
