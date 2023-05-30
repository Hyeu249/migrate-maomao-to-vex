const dotenv = require("dotenv");
const moduleAlias = require("module-alias");

class Config {
  constructor() {}

  static Bind() {
    return new Config();
  }

  UseModuleAlias() {
    moduleAlias.addAliases({
      "@server": __dirname + "/../",
    });
    return this;
  }

  UseEnv() {
    dotenv.config();
    return this;
  }
}

module.exports = Config;
