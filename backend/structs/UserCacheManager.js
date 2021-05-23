const User = require("./User");
const CacheManager = require("./CacheManager");

class UserCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, User, "UserModel", timeout);
  }
}

module.exports = UserCacheManager;