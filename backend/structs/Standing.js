const Base = require("./Base");

class Role extends Base {
  constructor(data, school) {
    super(school);
    this.perms = data.perms;
    this.user = data.user;
    this.class = data.class;
    this.assessments = data.assessments;
  }
}

module.exports = Role;