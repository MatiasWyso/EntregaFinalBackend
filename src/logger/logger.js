import winston from "winston";
import config from "../config/config.js";

const enviormentLevel = config.enviorment === "development" ? "debug" : "info";

const customLevelsOptions = {
  levels: {fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5},
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "green",
    http: "blue",
    debug: "white",
  },
};

const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: enviormentLevel,
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelsOptions.colors}),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./src/logger/errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};