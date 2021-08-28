const Base = require("./Base");
class Page extends Base {
  constructor(school, data) {
    super(school);
    this.id = data.id;
    this.class = data.class;
    this.modules = data.modules;
    this.name = data.name;
  }
}

module.exports = Page;