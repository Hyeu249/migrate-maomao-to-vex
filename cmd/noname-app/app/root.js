const Yargs = require("@server/lib/yargs");
const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const DriverTemplate = require("./template");
const TyreTemplate = require("./tyreTemplate");

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

    const queryTyre = `
    SELECT tbl_tires.update_date, tbl_tire_name.tire_short_name, tbl_admin_tires_production.tire_production, tbl_admin_tires_size.tire_size_name, tbl_tires.tire_serial, tbl_tires.tire_distance_limit
    FROM tbl_tires 
    LEFT JOIN tbl_tire_name on tbl_tires.tire_name_id = tbl_tire_name.tire_name_id
    LEFT JOIN tbl_admin_tires_production on tbl_tire_name.tire_name = tbl_admin_tires_production.tire_name_id
    LEFT JOIN tbl_admin_tires_size on tbl_tire_name.tire_size_id = tbl_admin_tires_size.tire_size_id
    `;

    const maomaoTb = await maomaoDb.query(queryTyre, { type: QueryTypes.SELECT });
    for (const [i, record] of maomaoTb.entries()) {
      if (i !== 1) continue;
      const tyre_id = uuidv4();
      const tyre = new TyreTemplate({
        id: tyre_id,
        create_time: record.create_date,
        update_time: record.update_date,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        name: record.tire_production,
        short_name: record.tire_short_name,
        specification: record.tire_size_name,
        serial_no: record.tire_serial,
        operation_limit_km: record.tire_distance_limit,
        replace_noti_max_threshold_km: 0,

        used_km: "",
        used_hours: "",
        last_usage_caclulated_at: "",
      });

      const warehouse = new WarehouseTemplate({
        id: uuidv4(),
        create_time: record.create_date,
        update_time: record.update_date,

        asset_warehouse_id: "",
        tyre_id: tyre_id,
      });

      const tyreQuery = `INSERT INTO tyres (${tyre.getFields()}) VALUES (${tyre.getValues()})`;
      const warehouseQuery = `INSERT INTO asset_warehouse_atyre_relations (${warehouse.getFields()}) VALUES (${warehouse.getValues()})`;
      // console.log("tyreQuery: ", tyreQuery);
      console.log("warehouseQuery: ", warehouseQuery);
      // var _ = await vexDb.query(tyreQuery, { transaction: tx, type: QueryTypes.INSERT });
      // var _ = await vexDb.query(warehouseQuery, { transaction: tx, type: QueryTypes.INSERT });
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
