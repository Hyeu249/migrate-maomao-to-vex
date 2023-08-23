const Yargs = require("@server/lib/yargs");
// const vehicleTypeHandler = require("@server/internal/handler/vehicleTypeHandler");
// const tyreHandler = require("@server/internal/handler/tyreHandler");
// const vehicleHandler = require("@server/internal/handler/vehicleHandler");
// const driverHandler = require("@server/internal/handler/driverHandler");
// const equipmentGroupHandler = require("@server/internal/handler/equipmentGroupHandler");
// const equipmentHandler = require("@server/internal/handler/equipmentHandler");
const supplierHandler = require("@server/internal/handler/supplierHandler");

const Version = require("./version");
Version.Use("1.0.0");

class App {
  constructor() {}

  static Execute() {
    Yargs.Start().command("migrate", "Migrate db.", supplierHandler).parse();
  }
}

module.exports = App;
