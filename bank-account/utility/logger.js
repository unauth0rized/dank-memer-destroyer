const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      //global.uncaughtExceptions.push(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `)
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
    }
    case "warn": {
      //global.uncaughtExceptions.push(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `)
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
    }
    case "error": {
      //global.uncaughtExceptions.push(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `)
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
    }
    case "debug": {
      //global.uncaughtExceptions.push(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `)
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    case "cmd": {
      //global.uncaughtExceptions.push(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`)
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case "ready": {
      //global.uncaughtExceptions.push(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`)
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");

exports.ready = (...args) => this.log(...args, "ready");