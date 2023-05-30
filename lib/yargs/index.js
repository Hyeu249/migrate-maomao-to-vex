const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const Support = require("./support");
class Yargs {
  constructor() {}

  static Start() {
    return yargs(hideBin(process.argv));
  }

  static Version() {
    return yargs.version;
  }

  static PersistentFlags() {
    return Support.PersistentFlags();
  }
}

module.exports = Yargs;
