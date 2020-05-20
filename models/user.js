const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
    
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  jobTitle:{
    type:String,
    required:true
  },
  joinDate:{
    type:Date,
    default:Date.now(),
    required:true
  },
  image:{
    type:String
  }
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}
userSchema.statics.getUsers =  function(){
  return  this.find();
}
userSchema.static('getuser',function(){
  return this.find();
})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object(
    {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
      jobTitle: Joi.string().min(5).required(),
      joinDate: Joi.date()
    }
  )

  return schema.validate(user);
}

exports.User = User; 
exports.validate = validateUser;
