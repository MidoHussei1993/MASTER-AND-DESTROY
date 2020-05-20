const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
  mongoose.connect('mongodb://localhost/taskManger',{useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => winston.info('Connected to MongoDB...'));
}