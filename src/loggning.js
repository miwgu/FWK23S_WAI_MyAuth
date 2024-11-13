const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'auth.log' }), // save as a file
      new winston.transports.Console() // Output to console
    ]
  });

  module.exports = logger;