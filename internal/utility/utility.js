const moment = require("moment");

const utility = {
  MySql: "mysql",
  Postgres: "postgres",
  notNull,
  getRandomNumber,
  now: now(),
  uppercaseFirstLetter,
};

module.exports = utility;

function notNull(e) {
  return e !== null;
}

function getRandomNumber(maxNumber) {
  return Math.floor(Math.random() * (maxNumber + 1));
}

function now() {
  return moment().format("YYYY-MM-DD");
}

function uppercaseFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
