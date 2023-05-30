const Config = require("../../config/config");
Config.Bind().UseModuleAlias().UseEnv();

const app = require("@server/cmd/noname-app/app/root");

function main() {
  app.Execute();
}

main();
