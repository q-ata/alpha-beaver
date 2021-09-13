const Submission = require("./Submission");
const CacheManager = require("./CacheManager");

class SubmissionCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Submission, "SubmissionModel", timeout);
  }
}

module.exports = SubmissionCacheManager;