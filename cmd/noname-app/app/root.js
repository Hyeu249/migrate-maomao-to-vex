const Yargs = require("@server/lib/yargs");
// const vehicleTypeHandler = require("@server/internal/handler/vehicleTypeHandler");
// const tyreHandler = require("@server/internal/handler/tyreHandler");
const vehicleHandler = require("@server/internal/handler/vehicleHandler");

const Version = require("./version");
Version.Use("1.0.0");

class App {
  constructor() {}

  static Execute() {
    Yargs.Start().command("migrate", "Migrate db.", vehicleHandler).parse();
  }
}

module.exports = App;
