const Yargs = require("@server/lib/yargs");
const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const Version = require("./version");
Version.Use("1.0.0");

class App {
  constructor() {}

  static Execute() {
    Yargs.Start().command("migrate", "Migrate db.", migrateHandler).parse();
  }
}

module.exports = App;

async function migrateHandler() {
  const MySql = "mysql";

  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, "root:test@tcp(localhost:3306)/vsico_api");
  const [vexDb, err2] = await Sequelize.Open(MySql, "root:test@tcp(localhost:3306)/vex_api");

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("error from db");

    const vexTb = await vexDb.query("SELECT * FROM `asset_warehouses`", { type: QueryTypes.SELECT });
    console.log("vexTb: ", vexTb[0]);

    const query = `INSERT INTO asset_warehouses (id , name, description) VALUES ('${uuidv4()}', 'hieu', 'hieu')`;
    // const vexIns = await vexDb.query(query, { type: QueryTypes.INSERT });

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    console.log("error: ", error.message);
  }
  var _ = await maomaoDb.close();
  var _ = await vexDb.close();
}

function notNull(e) {
  return e !== null;
}
