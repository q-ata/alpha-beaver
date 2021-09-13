const Base = require("./Base");
class Assignment extends Base {
  constructor(school, data) {
    super(school);
    this.title = data.title;
    this.class = data.class;
    this.desc = data.desc;
    this.id = data.id;
    this.due = data.due;
  }
}

module.exports = Assignment;