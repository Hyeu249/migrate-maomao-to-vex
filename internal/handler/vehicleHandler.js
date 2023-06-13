const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const VehicleTemplate = require("../template/vehicleTemplate");
const { MySql, Postgres, notNull, getRandomNumber, now } = require("@server/internal/utility/utility");

async function migrateVehicleHandler() {
  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, ["root", "test", "tcp", "localhost", "3306", "maomao-vsico"]);
  const [vexDb, err2] = await Sequelize.Open(Postgres, ["vex", "azn8UFY9wep@wej_nfx", "tcp", "localhost", "5432", "vex-db"]);

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const queryVehicle = `
      SELECT tbl_car.create_date, tbl_car.update_date,  tbl_car.car_num, tbl_car_type.name AS car_type, tire_struct, tbl_branch.full_name
      FROM tbl_car
      LEFT JOIN tbl_car_type ON tbl_car.car_type_id = tbl_car_type.car_type_id
      LEFT JOIN tbl_branch ON tbl_car.branch_id = tbl_branch.id
    `;

    const vehicleTbMaomao = await maomaoDb.query(queryVehicle, { type: QueryTypes.SELECT });
    const vehicleTypeTbVex = await vexDb.query(`SELECT id, name FROM vehicle_types`, { type: QueryTypes.SELECT });
    const tyreMapTbVex = await vexDb.query(`SELECT id, name FROM vehicle_tyre_maps`, { type: QueryTypes.SELECT });
    const warehouseTbVex = await vexDb.query(`SELECT id, name FROM asset_warehouses`, { type: QueryTypes.SELECT });
    const HCMorHN = warehouseTbVex.filter((e) => e.name.includes("HỒ CHÍ MINH") || e.name.includes("HÀ NỘI"));

    let vehicle_type_id;
    let vehicle_tyre_map_id;
    let asset_warehouse_id;

    for (const [i, record] of vehicleTbMaomao.entries()) {
      const tire_struct = "loại " + record.tire_struct;
      const randomWarehouseId = HCMorHN[getRandomNumber(HCMorHN.length - 1)].id;

      vehicle_type_id = vehicleTypeTbVex.find((e) => e.name === record.car_type).id;
      vehicle_tyre_map_id = tyreMapTbVex.find((e) => e.name.includes(tire_struct)).id;
      asset_warehouse_id = warehouseTbVex.find((e) => e.name === record.full_name)?.id || randomWarehouseId;

      wheel_count = whatWheelCount()[tyreMapTbVex.find((e) => e.name.includes(tire_struct)).name.trim()];

      // if (i !== 1) continue;
      const vehicle_id = uuidv4();
      const vehicle = new VehicleTemplate({
        id: vehicle_id,
        create_time: record.create_date || now,
        update_time: record.update_date || now,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        vehicle_type_id: vehicle_type_id,
        vehicle_tyre_map_id: vehicle_tyre_map_id,
        name: record.car_num,
        brand: "Không có",
        model: "Không có",
        build_date: now,
        wheel_count: wheel_count,
        origin: null,
        gps_key: null,
        tyre_rotation_max_threshold_km: 1000,
        is_trailer: false,
      });

      const vehicleQuery = `INSERT INTO vehicles (${vehicle.getFields()}) VALUES (${vehicle.getValues()})`;
      const vehicleWarehouseQuery = `INSERT INTO asset_warehouse_avehicle_relations (create_time, update_time, asset_warehouse_id, vehicle_id) VALUES ('${now}', '${now}', '${asset_warehouse_id}', '${vehicle_id}')`;

      var _ = await vexDb.query(vehicleQuery, { transaction: tx, type: QueryTypes.INSERT });
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

module.exports = migrateVehicleHandler;

function whatWheelCount() {
  return {
    "loại 1": 4,
    "loại 2": 6,
    "loại 3": 8,
    "loại 4": 10,
    "loại 5": 12,
    "loại 6": 14,
  };
}
