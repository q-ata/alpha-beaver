const Standing = require("./Standing");
const CacheManager = require("./CacheManager");

class StandingCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Standing, "StandingModel", timeout);
  }
}

module.exports = StandingCacheManager;