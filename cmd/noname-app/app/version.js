const yargs = require("@server/lib/yargs");

class Version {
  constructor() {}

  static Use(version) {
    yargs.Version(version);
    return this;
  }
}
module.exports = Version;
