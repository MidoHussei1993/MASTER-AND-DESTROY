const auth = require("../middleware/auth");
const _ = require("lodash");
const { Task, validate } = require("../models/task.model");
const mongoose = require("mongoose");
const express = require("express");
const { genSaltSync } = require("bcrypt");
const { route } = require("./project.route");
const router = express.Router();

//create task
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const task = new Task(
    _.pick(req.body,["fromUser", "toUser", "projectId", "description"])
  );
  const result = await task.save();
  res.status(200).send(result);
});

// get task by id
router.get('/:id',  async(req, res)=>{
  console.log()
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid task id..` }).populate([{path:'toUser',model:'User'},{path:'fromUser',model:'User'},{path:'projectId',model:'Project'}]);
   console.log(req.params.id);
  const task =await Task.findById(req.params.id);
  if (!task)
  return res.status(400).send({ message: "can`t find task with this id " });
  res.status(200).send(task);
})
//get tasks
router.get('/',  async(req, res)=>{
  const task =await Task.find().populate([{path:'toUser',model:'User'},{path:'fromUser',model:'User'},{path:'projectId',model:'Project'}]);
  if (!task)
  return res.status(400).send({ message: "can`t find any task" });
  console.log(task);
  res.status(200).json(task);
})
//get task send by user
router.get('/user-send/:id',  async(req, res)=>{
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid task id..` });
   
  const task =await Task.find({fromUser : req.params.id}).populate([{path:'toUser',model:'User'},{path:'projectId',model:'Project'}]);
  if (!task)
  return res.status(400).send({ message: "can`t find task with this id " });
  res.status(200).send(task);
})
//get task send for user
router.get('/user-recive/:id',  async(req, res)=>{
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid task id..` });
   
  const task =await Task.find({toUser : req.params.id}).populate([{path:'fromUser',model:'User'},{path:'projectId',model:'Project'}]);;
  if (!task)
  return res.status(400).send({ message: "can`t find task with this id " });
  res.status(200).send(task);
})
//get task of a spacific project
router.get('/project/:id',  async(req, res)=>{
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(400).send({ message: `invalid task id..` });
   
  const task =await Task.find({projectId : req.params.id}).select('start isFinish').populate([{path:'toUser',model:'User',select:'name'},{path:'fromUser',model:'User',select:'name'}]);
  if (!task)
  return res.status(400).send({ message: "can`t find task with this id " });
  res.status(200).send(task);
})
// get all finished tasks
router.get('/finish',  async(req, res)=>{
  const task =await Task.find({isFinish : false});
  if (!task)
  return res.status(400).send({ message: "can`t find task with this id " });
  res.status(200).send(task);
})
// get all un finished taskes
router.get('/unFinish',  async(req, res)=>{
  const task =await Task.find({isFinish : true});
  if (!task)
  return res.status(400).send({ message: "can`t find task with this id " });
  res.status(200).send(task);
})





module.exports = router;
