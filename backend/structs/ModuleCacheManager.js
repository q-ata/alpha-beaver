const Module = require("./Module");
const CacheManager = require("./CacheManager");

class ModuleCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Module, "ModuleModel", timeout);
  }
}

module.exports = ModuleCacheManager;