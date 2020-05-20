const auth = require("../middleware/auth");
const _ = require("lodash");
const { Attendance, validate } = require("../models/attendance.model");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/attend", auth, async (req, res) => {
  const isAttend = await Attendance.getIsAttend(req.user._id)
  if(isAttend){
    res.status(200).send('user have been attend today')
  }else{
    const attend = new Attendance({
      attend: new Date(),
      user:req.user._id
    })
    const result = await attend.save();
    res.status(200).send(result)
  }
});
router.post("/leave", auth, async (req, res) => {
  // const user = await Attendance.getUserAttend(req.user._id)
  // const isLeave = await Attendance.getIsAttend(req.user._id)
  // if(isLeave) return res.status(406).send({message:'you have already leave today'})
  // if(user.isAttend){
  //   const userLeave =await Attendance.findByIdAndUpdate(user.id,{
  //     $set:{
  //       leave:Date.now()
  //     }
  //   },{
  //     new:true
  //   })
  //   console.log(userLeave) 
  //   res.status(200).send(result)
  // }else{
  //   res.send('ok')
  // }
  // if(
  //   req.file.mimetype !=='image/png' ||
  //   req.file.mimetype !=='image/jpg' ||
  //   req.file.mimetype !=='image/hpeg') {
  //     return res.send({massage:'you should sent image'})
  //   }
  //422 mean invalid input
  if(req.file == undefined)return res.status(422).send('you should send image with png or jpg or hpeg')
  console.log(req.file.mimetype)

  console.log(req.file.path)
  res.send(req.file)
});

//cheak if user attend in the current date or not
router.get("/state", auth, async (req, res) => {
  // const attendanceState ={
  //   attend : await Attendance.getIsAttend(req.user._id),
  //   leave: await Attendance.getIsAttend(req.user._id)
  // } 
  // res.status(200).send(attendanceState)
});



module.exports = router;
