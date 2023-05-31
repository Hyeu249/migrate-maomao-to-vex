const Yargs = require("@server/lib/yargs");
const Sequelize = require("@server/lib/sequelize");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const DriverTemplate = require("./template");

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

    const queryDriver = `SELECT * FROM tbl_user join tbl_user_type on tbl_user.user_type = tbl_user_type.user_type_id where tbl_user_type.user_type_id in (12,13)`;

    const maomaoTb = await maomaoDb.query(queryDriver, { type: QueryTypes.SELECT });
    for (const [i, record] of maomaoTb.entries()) {
      // if (i !== 0) break;
      const full_name = record.full_name.split(" ").map(uppercaseFirstLetter);
      const address = record.address?.split(" ").map(uppercaseFirstLetter).join(" ");
      const driver = new DriverTemplate({
        id: uuidv4(),
        create_time: record.create_date,
        update_time: record.update_date,
        created_by: "",
        last_updated_by: "",
        deleted_by: "",
        deleted_at: "",

        first_name: full_name.slice(1).join(" "),
        last_name: full_name[0],
        date_of_birth: record.birthday,
        national_id_card_no: record.identity_id || "chưa có" + i,
        tax_id: null,
        address: address,
        phone: record.phone || "chưa có" + i,
        email: record.email,
        join_date: record.start_job,
        exit_date: record.end_working_date,
        advance_payment_limit: 0,
        advance_payment_amount: 0,
        deposit_amount: 0,
        job_status: undefined,
        driver_deposit_type_id: null,
      });

      const query = `INSERT INTO vehicle_drivers (${driver.getFields()}) VALUES (${driver.getValues()})`;
      // console.log("query: ", query);
      const _ = await vexDb.query(query, { transaction: tx, type: QueryTypes.INSERT });
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
