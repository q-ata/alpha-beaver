const AggregatedPermissions = require("./AggregatedPermissions");
const Base = require("./Base");

class Standing extends Base {
  constructor(school, data) {
    super(school);
    this.perms = new AggregatedPermissions(data.perms);
    this.user = data.user;
    this.class = data.class;
    this.assessments = data.assessments;
  }
}

module.exports = Standing;