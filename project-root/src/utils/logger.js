const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const logError = (error) => {
  logger.error(error.message, { stack: error.stack });
};

const logInfo = (message) => {
  logger.info(message);
};

const logDebug = (message) => {
  logger.debug(message);
};

module.exports = {
  logError,
  logInfo,
  logDebug,
};