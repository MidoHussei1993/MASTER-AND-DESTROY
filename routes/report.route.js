const auth = require("../middleware/auth");
const _ = require("lodash");
const { Report, validate } = require("../models/report.mode");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//create report
router.post("/", auth, async (req, res) => {
    req.body.fromUser = req.body.id
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = new Report(
    _.pick(req.body, ["formUser", "toUser", "taskId", "rate", "description","projectId"])
  );
  await user.save();

  res.status(200).send({ message: "report created..." });
});
//delete report
router.delete("/:id", auth, async (req, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValid) return res.status(400).send({ message: `invalid project id..` });
  
    const result = await Report.findByIdAndDelete(req.params.id)
    if(result === null) return res.status(401).status({message:'can`t not found report with this is id '})
    else res.status(200).send(reports)
  });
//get all send report by user
router.get("/", auth, async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.body.id);
  if (!isValid) return res.status(400).send({ message: `invalid user id..` });

  const reports = await Report.find({'fromUser': mongoose.Types.ObjectId(req.body.id)})

  res.status(200).send(reports)
});
//get all reports send to user
router.get("/sent", auth, async (req, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(req.body.id);
    if (!isValid) return res.status(400).send({ message: `invalid user id..` });
  
    const reports = await Report.find({'toUser': { $in: req.body.id }})
  
    res.status(200).send(reports)
  });
//get all report of prject
router.get("/project-reports/:id", auth, async (req, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValid) return res.status(400).send({ message: `invalid project id..` });
  
    const reports = await Report.find({ projectId: { $in:req.params.id }})
  
    res.status(200).send(reports)
  });
//get all report of task
router.get("/task-reports/:id", auth, async (req, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValid) return res.status(400).send({ message: `invalid project id..` });
  
    const reports = await Report.find({ taskId: { $in: req.params.id }})
  
    res.status(200).send(reports)
  });