const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
        }),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
