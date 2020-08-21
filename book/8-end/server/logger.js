const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(winston.format.splat(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
