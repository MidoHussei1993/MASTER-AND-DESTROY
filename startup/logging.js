const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  
  process.on('unhandledRejection', (ex) => {
    console.log('yes im fire')
    throw ex;
  });
  
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.loggers.add('mongoLog',{
    transports : [
        new(winston.transports.MongoDB)({
            db : 'mongodb://localhost/taskManger',
            collection : 'log',
            level : 'info',
            capped : true,
            options: {
              useUnifiedTopology: true,
          }
        }),
    ]
}); 

  
}