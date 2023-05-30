const common = require("../common");

function splitSpecificDbStrForMySql(type, str) {
  if (type === "username") {
    return common.SplitSequence(str, [":"], [0]);
  }

  if (type === "database") {
    return common.SplitSequence(str, ["/"], [1]);
  }

  if (type === "password") {
    return common.SplitSequence(str, [":", "@"], [1, 0]);
  }

  if (type === "host") {
    return common.SplitSequence(str, ["(", ")", ":"], [1, 0, 0]);
  }

  if (type === "port") {
    return common.SplitSequence(str, ["(", ")", ":"], [1, 0, 1]);
  }

  if (type === "protocol") {
    return common.SplitSequence(str, ["@", "("], [1, 0]);
  }
}

module.exports = {
  ParseDbStr: function (dbStr) {
    let database, username, password, host, port, protocol;

    username = splitSpecificDbStrForMySql("username", dbStr);
    database = splitSpecificDbStrForMySql("database", dbStr);
    password = splitSpecificDbStrForMySql("password", dbStr);
    host = splitSpecificDbStrForMySql("host", dbStr);
    port = splitSpecificDbStrForMySql("port", dbStr);
    protocol = splitSpecificDbStrForMySql("protocol", dbStr);

    return { username, password, protocol, host, port, database };
  },
};
