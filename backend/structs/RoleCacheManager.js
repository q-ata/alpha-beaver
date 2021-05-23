const Role = require("./Role");
const CacheManager = require("./CacheManager");

class RoleCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Role, "RoleModel", timeout);
  }
}

module.exports = RoleCacheManager;