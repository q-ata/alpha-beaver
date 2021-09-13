const Grade = require("./Grade");
const CacheManager = require("./CacheManager");

class GradeCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Grade, "GradeModel", timeout);
  }
}

module.exports = GradeCacheManager;