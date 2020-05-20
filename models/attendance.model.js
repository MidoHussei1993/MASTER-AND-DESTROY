const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  attend: {
    type: Date,
  },
  leave: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
attendanceSchema.statics.getIsAttend = async function (userId) {
  const userAttendance = await this.find({ user: userId })
    .sort({ attend: -1 })
    .limit(1);
  if (userAttendance.length < 1) {
    return false;
  } else {
    const userAttendanceLastDate = new Date(userAttendance[0].attend);
    const dateNow = new Date();
    if (
      dateNow.getDate() === userAttendanceLastDate.getDate() &&
      dateNow.getMonth() === userAttendanceLastDate.getMonth()
    ) {
      return true;
    } else {
      return false;
    }
  }
};
attendanceSchema.statics.getIsLeave = async function (userId) {
  const userAttendance = await this.find({ user: userId })
    .sort({ leave: -1 })
    .limit(1);
    console.log(userAttendance)
  if (userAttendance.length < 1) {
    return false;
  } else {
    const userAttendanceLastDate = new Date(userAttendance[0].leave);
    const dateNow = new Date();
    if (
      dateNow.getDate() === userAttendanceLastDate.getDate() &&
      dateNow.getMonth() === userAttendanceLastDate.getMonth()
    ) {
      return true;
    } else {
      return false;
    }
  }
};


attendanceSchema.statics.getUserAttend = async function (userId) {
  const userAttendance = await this.find({ user: userId })
    .sort({ attend: -1 })
    .limit(1);
  if (userAttendance.length < 1) {
    return  {isAttend: true,id : userAttendance[0]._id };
  } else {
    const userAttendanceLastDate = new Date(userAttendance[0].attend);
    const dateNow = new Date();
    if (
      dateNow.getDate() === userAttendanceLastDate.getDate() &&
      dateNow.getMonth() === userAttendanceLastDate.getMonth()
    ) {
      return {isAttend: true,id : userAttendance[0]._id };
    } else {
      return  {isAttend: true,id : userAttendance[0]._id };
    }
  }
};

const Attendance = mongoose.model("Attendance", attendanceSchema);

function validateUserAttendance(user) {
  const schema = Joi.object({
    user: Joi.objectId(),
  });

  return schema.validate(user);
}

exports.Attendance = Attendance;
exports.validate = validateUserAttendance;
