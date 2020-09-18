const winston = require('winston');

const dev = process.env.NODE_ENV !== 'production';

const logger = winston.createLogger({
  level: dev ? 'debug' : 'info',
  format: winston.format.combine(winston.format.splat(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
