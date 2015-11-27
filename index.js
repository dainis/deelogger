"use strict";

var winston = require('winston'),
  sentry = require('winston-sentry');;

if(process.env.SENTRY_DSN) {
  new sentry({
    patchGlobal : true
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
  };

  winston.loggers.add(label, loggers);

  return winston.loggers.get(label);
};