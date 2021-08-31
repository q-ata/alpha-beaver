const Base = require("./Base");

class Role extends Base {
  constructor(school, data) {
    super(school);
    this.id = data.id;
    this.perms = data.perms;
    this.name = data.name;
    this.class = data.class;
  }
}

module.exports = Role;