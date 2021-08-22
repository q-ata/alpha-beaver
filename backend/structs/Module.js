const Base = require("./Base");
class Module extends Base {
  constructor(school, data) {
    super(school);
    this.id = data.id;
    this.class = data.class;
    this.page = data.page;
    this.type = data.type;
    this.data = data.data;
  }
}

module.exports = Module;