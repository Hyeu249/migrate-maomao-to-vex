const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const EquipmentGroupTemplate = require("../template/equipmentGroupTemplate");
const { MySql, Postgres, notNull } = require("@server/internal/utility/utility");

async function migrateEquipmentGroupHandler() {
  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, ["root", "test", "tcp", "localhost", "3306", "maomao-vsico"]);
  const [vexDb, err2] = await Sequelize.Open(Postgres, ["vex", "azn8UFY9wep@wej_nfx", "tcp", "localhost", "5432", "vex-db"]);

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const query = `
      SELECT name FROM equipment_groups
    `;

    const maomaoTable = await maomaoDb.query(query, { type: QueryTypes.SELECT });
    for (const [i, record] of maomaoTable.entries()) {
      // if (i !== 1) continue;
      const id = uuidv4();
      const equipmentGroup = new EquipmentGroupTemplate({
        id: id,
        create_time: record.create_date,
        update_time: record.update_date,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        name: record.name,
        equipment_type: "MATERIAL",
        description: "",
      });

      const equipmentGroupQuery = `INSERT INTO equipment_groups (${equipmentGroup.getFields()}) VALUES (${equipmentGroup.getValues()})`;

      var _ = await vexDb.query(equipmentGroupQuery, {
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

module.exports = migrateEquipmentGroupHandler;
