const Assignment = require("./Assignment");
const CacheManager = require("./CacheManager");

class AssignmentCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Assignment, "AssignmentModel", timeout);
  }
}

module.exports = AssignmentCacheManager;