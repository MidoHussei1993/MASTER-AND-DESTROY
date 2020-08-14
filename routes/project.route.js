const auth = require("../middleware/auth");
const _ = require("lodash");
const { Project, validate } = require("../models/project.model");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//get all project
router.get("/", auth, async (req, res) => {
  const projects = await Project.getProjects();
  if (!projects)
    return res.status(400).send({ message: "can`t find any project" });
  res.status(200).send(projects);
});
//get one project by id
router.get("/:id", auth, async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id)
  if(!isValid) return res.status(400).send({message:`invalid project id..`});
  const projects = await Project.getProject(req.params.id);
  if (!projects)
    return res.status(400).send({ message: "can`t find any project" });
  res.status(200).send(projects);
});
//create
router.post("/", auth, async (req, res) => {
  const image = req.file;
  if(!image) return res.status(401).send({message:'you should upload file'})
  console.log(image)
  // image.path : the path of image in server
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let project = await Project.findOne({ name: req.body.name});
  if (project) return res.status(400).send("User already registered.");
  project = new Project({
    name:req.body.name,
    image:image.path 
  });
  const result = await project.save();
  res.status(200).send(result);
});

module.exports = router;
