/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const chalk = require('chalk');
const notifier = require('node-notifier');


function format(time = 0) {
  let timeString = `${time}ms`;

  if (time >= 1000 && time < 60000) {
    const seconds = Math.floor(time / 1000);
    const rest = time - (seconds * 1000);

    timeString = `${seconds}s ${format(rest)}`;
  }

  if (time >= 60000) {
    const minutes = Math.floor(time / 60000);
    const rest = time - (minutes * 60000);

    timeString = `${minutes}m ${format(rest)}`;
  }

  return timeString;
}


function start(task = 'task') {
  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
    `Starting ${task}...`,
  );
}
module.exports.start = start;


function finish(task = 'task', time = 0) {
  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
    `Finished ${task} after ${chalk.blue(format(time))}`,
  );
}
module.exports.finish = finish;


function error(task = 'task', err = {}) {
  const message = err.formatted || err.message || 'no error message';

  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
    `Catched ${task} error:`,
  );
  console.log(chalk.red(message));

  notifier.notify({
    title: `Catched ${task} error:`,
    message,
  });
}
module.exports.error = error;