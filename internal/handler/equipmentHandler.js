const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const EquipmentTemplate = require("../template/equipmentTemplate");
const { MySql, Postgres, notNull, now } = require("@server/internal/utility/utility");

async function migrateEquipmentHandler() {
  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, ["root", "test", "tcp", "localhost", "3306", "vex-db"]);
  const [vexDb, err2] = await Sequelize.Open(Postgres, ["vex", "azn8UFY9wep@wej_nfx", "tcp", "localhost", "5432", "vex-db"]);

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const query = `
      SELECT * FROM equipment
    `;

    const maomaoTable = await maomaoDb.query(query, { type: QueryTypes.SELECT });
    const equipmentGroupTbVex = await vexDb.query(`SELECT id, name FROM equipment_groups WHERE equipment_type = 'MATERIAL'`, {
      type: QueryTypes.SELECT,
    });

    const maintenanceTypeTbVex = await vexDb.query(`SELECT id, name FROM maintenance_types`, {
      type: QueryTypes.SELECT,
    });

    for (const [i, record] of maomaoTable.entries()) {
      let equipment_group_id = equipmentGroupTbVex.find((e) => e.name == record.equipment_group_id.trim())?.id;
      let maintenance_type_id = maintenanceTypeTbVex.find((e) => e.name === record.maintenance_type_id).id;
      const asset_warehouse_id = "536358be-f2ca-44bc-b1d6-4088ae767e92";

      const equipment_id = uuidv4();
      const asset_warehouse_aequipment_relations_id = uuidv4();

      const equipment = new EquipmentTemplate({
        id: equipment_id,
        create_time: record.create_date || now,
        update_time: record.update_date || now,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        name: record.name,
        description: record.description,
        manufacturer: record.manufacturer || "Chưa có",
        is_reusable: false,
        // maintenance_cycle_km: record.maintenance_cycle_km,
        // maintenance_cycle_hour: record.maintenance_cycle_hour,
        equipment_group_id: equipment_group_id,
        maintenance_type_id: maintenance_type_id,
      });

      const equipmentQuery = `INSERT INTO equipment (${equipment.getFields()}) VALUES (${equipment.getValues()})`;
      const equipmentWarehouseQuery = `INSERT INTO asset_warehouse_aequipment_relations (id, create_time, update_time, asset_warehouse_id, equipment_id) VALUES ('${asset_warehouse_aequipment_relations_id}', '${now}', '${now}', '${asset_warehouse_id}', '${equipment_id}')`;

      var _ = await vexDb.query(equipmentQuery, { transaction: tx, type: QueryTypes.INSERT });
      var _ = await vexDb.query(equipmentWarehouseQuery, { transaction: tx, type: QueryTypes.INSERT });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    console.log("error: ", error);
  }
  var _ = await maomaoDb.close();
  var _ = await vexDb.close();
}

module.exports = migrateEquipmentHandler;
