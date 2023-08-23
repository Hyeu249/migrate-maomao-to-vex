const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const SupplierTemplate = require("../template/supplierTemplate");
const { MySql, Postgres, notNull, now } = require("@server/internal/utility/utility");

async function migrateSupplierHandler() {
  //require dbStr var formated like username:password@protocol(host:port)/database
  const [maomaoDb, err1] = await Sequelize.Open(MySql, ["root", "test", "tcp", "localhost", "3306", "vex-db"]);
  const [vexDb, err2] = await Sequelize.Open(Postgres, ["vex", "azn8UFY9wep@wej_nfx", "tcp", "localhost", "5432", "vex-db"]);

  const tx = await vexDb.transaction();

  try {
    if ([err1, err2].some(notNull)) throw Error("Error when connecting to db");

    const query = `
      SELECT * FROM Sheet2
    `;

    const supplierTbMaomao = await maomaoDb.query(query, { type: QueryTypes.SELECT });
    const supplyTypeTbVex = await vexDb.query(`SELECT id, name FROM supply_types`, { type: QueryTypes.SELECT });

    for (const [i, record] of supplierTbMaomao.entries()) {
      const supply_type_id = supplyTypeTbVex.find((e) => e.name === record.supply_type_name.trim()).id;

      // if (i !== 1) continue;
      const tyre_id = uuidv4();
      const tyre = new SupplierTemplate({
        id: tyre_id,
        create_time: record.create_date || now,
        update_time: record.update_date || now,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        name: record.name,
        short_name: record.short_name,
        agent_name: record.agent_name,
        address: record.address,
        additional_option: record.additional_option,
        phone: record.phone,
        email: record.email,
        supply_type_id: supply_type_id,
      });

      const supplierQuery = `INSERT INTO suppliers (${tyre.getFields()}) VALUES (${tyre.getValues()})`;

      var _ = await vexDb.query(supplierQuery, { transaction: tx, type: QueryTypes.INSERT });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    console.log("error: ", error);
  }
  var _ = await maomaoDb.close();
  var _ = await vexDb.close();
}

module.exports = migrateSupplierHandler;
