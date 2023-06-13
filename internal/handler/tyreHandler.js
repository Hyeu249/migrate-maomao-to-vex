const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const TyreTemplate = require("../template/tyreTemplate");
const { MySql, Postgres, notNull, getRandomNumber, now } = require("@server/internal/utility/utility");

async function migrateTyreHandler() {
  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, ["root", "test", "tcp", "localhost", "3306", "maomao-vsico"]);
  const [vexDb, err2] = await Sequelize.Open(Postgres, ["vex", "azn8UFY9wep@wej_nfx", "tcp", "localhost", "5432", "vex-db"]);

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

    const tyreTbMaomao = await maomaoDb.query(queryTyre, { type: QueryTypes.SELECT });
    const warehouseTbVex = await vexDb.query(`SELECT id, name FROM asset_warehouses`, { type: QueryTypes.SELECT });

    const HCMorHN = warehouseTbVex.filter((e) => e.name.includes("HỒ CHÍ MINH") || e.name.includes("HÀ NỘI"));

    for (const [i, record] of tyreTbMaomao.entries()) {
      const asset_warehouse_id = HCMorHN[getRandomNumber(HCMorHN.length - 1)].id;
      // if (i !== 1) continue;
      const tyre_id = uuidv4();

      const tyre = new TyreTemplate({
        id: tyre_id,
        create_time: now,
        update_time: now,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        name: record.tire_production || "Không có",
        short_name: record.tire_short_name || "Không có",
        specification: record.tire_size_name || "Không có",
        serial_no: record.tire_serial + "-" + i,
        operation_limit_km: record.tire_distance_limit,
        replace_noti_max_threshold_km: 1000,

        used_km: "",
        used_hours: "",
        last_usage_caclulated_at: "",
      });

      const tyreQuery = `INSERT INTO tyres (${tyre.getFields()}) VALUES (${tyre.getValues()})`;
      const tyreWarehouseQuery = `INSERT INTO asset_warehouse_atyre_relations (id, create_time, update_time, asset_warehouse_id, tyre_id) VALUES ('${uuidv4()}', '${now}', '${now}', '${asset_warehouse_id}', '${tyre_id}')`;

      var _ = await vexDb.query(tyreQuery, { transaction: tx, type: QueryTypes.INSERT });
      var _ = await vexDb.query(tyreWarehouseQuery, { transaction: tx, type: QueryTypes.INSERT });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    console.log("error: ", error);
  }
  var _ = await maomaoDb.close();
  var _ = await vexDb.close();
}

module.exports = migrateTyreHandler;
