const express = require('express');
const users = require('../routes/users');
const attendance = require('../routes/attendance.route');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')


// multer configaration object
const fileStorage = multer.diskStorage({
  destination: (req , file , cb)=>{
    //first argument in call back is the error object
    //socend is the destination (the place you want to store into it)
    //call back function to tell multer where to store data
    cb(null , 'user-image')
  },
  filename:(req , file , cb)=>{
    //callBack function here to multer know how to name file
    //socend argument in call back function to name the file
    // cb(null , 'anyname.png' )
    //  file.filename : hold the original name of the file
    // file.filename return random hash by multer NOTICE it will work here becouse we use file name method
    cb(null ,  Date.now() + '-' + file.originalname )// his to make sure if user aplouad file with the same name it will work becouse(file.filename)
  }
})
//to allow certain kinds of files
const fileFilter = (req , file ,cb)=>{
  if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/hpeg'){
    cb(null ,true)//if we want to accept this is file
  }else{
     cb(null ,false)//if we want toNOT STORE THIS FILE 
  }
}
module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  //we use single becosuse we excpect one file in api with key image
  // we use dest to set the  location of incoming file with name image
  // app.use(multer({dest:'user-image'}).single('image'));
  app.use(multer({storage:fileStorage , fileFilter: fileFilter}).single('image'));//this for more configuration
  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/attendance', attendance);
  app.use('/api/auth', auth);
  app.use(error);
}