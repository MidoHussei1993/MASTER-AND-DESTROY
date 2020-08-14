const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
     toUser: [{
       type:mongoose.Schema.Types.ObjectId,
       ref: "User",
       required : true
     }],
      description:{
        type: String,
        required:true
    },
    start:{
        type : Date,
        default: Date.now(),
        required:true
    },
    end:{
        type : Date,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },   
      isFinish:{
        type: Boolean,
        default: false
      },
      Completion:{
        type: Number,
        default:0,
        min: 0,
        max: 100
      }
})

const Task = mongoose.model('Task',taskSchema);

function validateTask(roport) {
  const schema = Joi.object({
    toUser: Joi.array().items(Joi.objectId()).required(),
       projectId: Joi.objectId().required(),
       fromUser: Joi.objectId().required(),
      description:Joi.string().required()
  });

  return schema.validate(roport);
}

exports.Task = Task;
exports.validate = validateTask;