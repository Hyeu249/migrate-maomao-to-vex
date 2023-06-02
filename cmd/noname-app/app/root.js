const Yargs = require("@server/lib/yargs");
const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const vehicleTemplate = require("./vehicleTemplate");

const Version = require("./version");
Version.Use("1.0.0");

class App {
  constructor() {}

  static Execute() {
    Yargs.Start().command("migrate", "Migrate db.", migrateVehicleHandler).parse();
  }
}

module.exports = App;

async function migrateVehicleHandler() {
  const MySql = "mysql";

  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, "root:test@tcp(localhost:3306)/maomao-vsico");
  const [vexDb, err2] = await Sequelize.Open(MySql, "root:test@tcp(localhost:3306)/vex-db");

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const queryVehicle = `
      SELECT tbl_car.create_date, tbl_car.update_date,  tbl_car.car_num, tbl_car_type.name AS car_type, tire_struct, tbl_branch.full_name
      FROM tbl_car
      LEFT JOIN tbl_car_type ON tbl_car.car_type_id = tbl_car_type.car_type_id
      LEFT JOIN tbl_branch ON tbl_car.branch_id = tbl_branch.id
    `;

    const maomaoTb = await maomaoDb.query(queryVehicle, { type: QueryTypes.SELECT });
    const warehouseTb = await vexDb.query(`SELECT id, name FROM asset_warehouses`, { type: QueryTypes.SELECT });
    const vehicleTypeTb = await vexDb.query(`SELECT id, name FROM vehicle_types`, { type: QueryTypes.SELECT });
    const tyreMapTb = await vexDb.query(`SELECT id, name FROM vehicle_tyre_maps`, { type: QueryTypes.SELECT });

    let vehicle_type_id;
    let vehicle_tyre_map_id;
    let asset_warehouse_id;

    for (const [i, record] of maomaoTb.entries()) {
      vehicle_type_id = vehicleTypeTb.find((e) => e.name === record.car_type).id;
      vehicle_tyre_map_id = tyreMapTb.find((e) => e.name.includes(record.tire_struct)).id;
      asset_warehouse_id = warehouseTb.find((e) => e.name === record.full_name)?.id;

      // if (i !== 1) continue;
      const vehicle_id = uuidv4();
      const vehicle = new vehicleTemplate({
        id: vehicle_id,
        create_time: record.create_date,
        update_time: record.update_date,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        vehicle_type_id: vehicle_type_id,
        vehicle_tyre_map_id: vehicle_tyre_map_id,
        name: record.car_num,
        brand: null,
        model: null,
        build_date: null,
        wheel_count: null,
        origin: null,
        gps_key: null,
        tyre_rotation_max_threshold_km: null,
        is_trailer: false,
      });

      if (!asset_warehouse_id) continue;
      if (!vehicle_type_id) continue;
      if (!vehicle_tyre_map_id) continue;

      const vehicleQuery = `INSERT INTO vehicles (${vehicle.getFields()}) VALUES (${vehicle.getValues()})`;
      // console.log("vehicleQuery: ", vehicleQuery);
      var _ = await vexDb.query(vehicleQuery, { transaction: tx, type: QueryTypes.INSERT });

      const vehicleWarehouseQuery = `INSERT INTO asset_warehouse_avehicle_relations (asset_warehouse_id, vehicle_id) VALUES ('${asset_warehouse_id}', '${vehicle_id}')`;
      // console.log("vehicleWarehouseQuery: ", vehicleWarehouseQuery);

      var _ = await vexDb.query(vehicleWarehouseQuery, { transaction: tx, type: QueryTypes.INSERT });
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
