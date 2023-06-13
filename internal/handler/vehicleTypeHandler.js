const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const VehicleTypeTemplate = require("../template/vehicleTypeTemplate");
const { MySql, Postgres, notNull } = require("@server/internal/utility/utility");

async function migrateVehicleTypeHandler() {
  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, ["root", "test", "tcp", "localhost", "3306", "maomao-vsico"]);
  const [vexDb, err2] = await Sequelize.Open(Postgres, ["vex", "azn8UFY9wep@wej_nfx", "tcp", "localhost", "5432", "vex-db"]);

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const query = `
      SELECT * FROM tbl_car_type 
      WHERE work_status = 1
    `;

    const vehicleTypeTbMaomao = await maomaoDb.query(query, { type: QueryTypes.SELECT });
    for (const [i, record] of vehicleTypeTbMaomao.entries()) {
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

      var _ = await vexDb.query(vehicleTypeQuery, {
        transaction: tx,
        type: QueryTypes.INSERT,
      });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    console.log("error: ", error);
  }
  var _ = await maomaoDb.close();
  var _ = await vexDb.close();
}

module.exports = migrateVehicleTypeHandler;
