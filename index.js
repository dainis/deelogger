"use strict";

var winston = require('winston'),
  sentry = require('winston-sentry');

if(process.env.SENTRY_DSN) {
  new sentry({
    patchGlobal : true,
    dsn         : process.env.SENTRY_DSN
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
      dsn   : process.env.SENTRY_DSN
    };
  }

  winston.loggers.add(label, loggers);

  if(process.env.NODE_ENV === 'test') {
    winston.loggers.get(label).remove(winston.transports.Console);
  }

  return winston.loggers.get(label);
};