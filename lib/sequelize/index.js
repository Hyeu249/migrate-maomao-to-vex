const { Sequelize } = require("sequelize");

const { ParseDbStr } = require("./support");

class Sequelize_ {
  constructor() {}

  static Open = OpenConnection;
}
module.exports = Sequelize_;

async function OpenConnection(dbType, dbStr) {
  try {
    //require dbStr var formated like username:password@protocol(host:port)/database
    const [username, password, protocol, host, port, database] = dbStr;

    const sequelizeDb = new Sequelize(database, username, password, {
      host: host,
      port: port,
      protocol: protocol,
      dialect: dbType,
      logging: false,
    });
    await sequelizeDb.authenticate();

    return [sequelizeDb, null];
  } catch (error) {
    return [null, error];
  }
}
