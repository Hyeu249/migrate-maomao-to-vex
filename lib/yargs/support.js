function StringVar(describe, defaultValue, alias, demandOption = false) {
  return {
    alias: alias,
    demandOption: demandOption,
    default: defaultValue,
    describe: describe,
    type: "string",
  };
}

function IntVar(describe, defaultValue, alias, demandOption = false) {
  return {
    alias: alias,
    demandOption: demandOption,
    default: defaultValue,
    describe: describe,
    type: "number",
  };
}
function BoolVarP(describe, alias, defaultValue = false, demandOption = false) {
  return {
    alias: alias,
    demandOption: demandOption,
    default: defaultValue,
    describe: describe,
    type: "boolean",
  };
}

class Support {
  constructor() {}
  static PersistentFlags() {
    return {
      StringVar: StringVar,
      IntVar: IntVar,
      BoolVarP: BoolVarP,
    };
  }
}

module.exports = Support;
