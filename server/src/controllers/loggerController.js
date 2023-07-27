const { createLogger, format, transports } = require("winston");
const { addColors } = require("winston/lib/winston/config");
const myCustomLevels = {
  levels: {
    foo: 0,
    bar: 1,
    baz: 2,
    foobar: 3,
  },
  colors: {
    foo: "blue",
    bar: "green",
    baz: "yellow",
    foobar: "red",
  },
};
const logger = createLogger({
  //level: "info",
  // format: format.json(),
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),

  transports: [
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
    // new transports.File({ filename: "combined.log" }),

    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
      //maxsize: 5242880, // 5MB
    }),
    new transports.File({
      filename: "src/logs/error.log",
      level: "error",
      //maxsize: 5242880, // 5MB
    }),
  ],
});

module.exports = logger;
