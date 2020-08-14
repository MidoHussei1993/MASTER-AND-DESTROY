const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 toUser: [{
   type:mongoose.Schema.Types.ObjectId,
   ref: "User",
    required: true,
 }],
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  description:{
      type: String,
      required:true
  },
  //the percent of holl work in project
  rate:{
      tyep:Number,
      min:1,
      max:100
  },
  isRead:{
      type:Boolean,
      default:false
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});




attendanceSchema.statics.getReports= async function () {
  const userAttendance = await this.find()
    
};




function validateReport(roport) {
    const schema = Joi.object({
      fromUser: Joi.objectId().required(),
        toUser: Joi.array().items(Joi.object().keys().min(1)).required(),
        taskId: Joi.objectId().required(),
         projectId: Joi.array().items().required(),
        rate:Joi.number().min(1).max(100),
        description:Joi.string().required()
    });
  
    return schema.validate(roport);
  }

const Report = mongoose.model('Report', reportSchema)


exports.Report = Report;
exports.validate = validateReport;