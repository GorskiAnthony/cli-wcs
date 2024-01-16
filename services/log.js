const chalk = require("chalk");

// success
function success(message) {
  console.log(chalk.greenBright(message));
}

// error
function error(message) {
  console.log(chalk.redBright(message));
}

module.exports = {
  success,
  error,
};
