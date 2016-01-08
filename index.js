"use strict";

var winston = require('winston'),
  sentry = require('winston-sentry');

require('winston-papertrail').Papertrail;

if(process.env.SENTRY_DSN) {
  new sentry({
    dsn : process.env.SENTRY_DSN
  });
}

module.exports = function(label) {
  var loggers = {
    console : {
      level : 'silly',
      colorize : true,
      prettyPrint : true,
      timestamp : true,
      label : label
    }
  };

  if(process.env.SENTRY_DSN) {
    loggers.sentry = {
      level : 'error',
      dsn   : process.env.SENTRY_DSN,
      handleExceptions : true
    };
  }

  if(process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
    loggers.Papertrail = {
      level    : 'debug',
      host     : process.env.PAPERTRAIL_HOST,
      port     : process.env.PAPERTRAIL_PORT,
      colorize : true
    };
  }

  winston.loggers.add(label, loggers);

  if(process.env.NODE_ENV === 'test') {
    winston.loggers.get(label).remove(winston.transports.Console);
  }

  let logger = winston.loggers.get(label);

  logger.exitOnError = true;

  return logger;
};
