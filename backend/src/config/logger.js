import winston from 'winston';

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    debug: 'white'
  }
};

const logger = winston.createLogger({
  levels: customLevelsOptions.levels, 
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      )
    }),
    new winston.transports.Console({
      level: 'fatal',
      filename: 'logs/errors.log',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/errors.log',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      )
    }),
    new winston.transports.Console({
      level: 'warning',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      )
    }),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      )
    })
    
  ]
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};