const Class = require("./Class");
const CacheManager = require("./CacheManager");

class ClassCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Class, "ClassModel", timeout);
  }
}

module.exports = ClassCacheManager;