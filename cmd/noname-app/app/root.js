const Yargs = require("@server/lib/yargs");
const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const VehicleTypeTemplate = require("./vehicleTypeTemplate");

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
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const query = `
      SELECT * FROM tbl_car_type 
      WHERE work_status = 1
    `;

    const maomaoTb = await maomaoDb.query(query, { type: QueryTypes.SELECT });
    for (const [i, record] of maomaoTb.entries()) {
      // if (i !== 1) continue;
      const tyre_id = uuidv4();
      const tyre = new VehicleTypeTemplate({
        id: tyre_id,
        create_time: record.create_date,
        update_time: record.update_date,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        name: record.name,
        description: "",
      });

      const vehicleTypeQuery = `INSERT INTO vehicle_types (${tyre.getFields()}) VALUES (${tyre.getValues()})`;
      // console.log("vehicleTypeQuery: ", vehicleTypeQuery);
      var _ = await vexDb.query(vehicleTypeQuery, { transaction: tx, type: QueryTypes.INSERT });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    console.log("error: ", error);
  }
  var _ = await maomaoDb.close();
  var _ = await vexDb.close();
}

function notNull(e) {
  return e !== null;
}

function uppercaseFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

class WarehouseTemplate {
  constructor(data = {}) {
    if (data.create_time) this.create_time = makeString(data.create_time);
    if (data.update_time) this.update_time = makeString(data.update_time);

    if (data.id) this.id = makeString(data.id);
    if (data.asset_warehouse_id) this.asset_warehouse_id = makeString(data.asset_warehouse_id);
    if (data.tyre_id) this.tyre_id = makeString(data.tyre_id);
  }

  getFields() {
    return Object.keys(this).join(", ");
  }
  getValues() {
    return Object.values(this).join(", ");
  }
}

function makeString(value) {
  return `'${String(value.trim() || "")}'`;
}
