const Base = require("./Base");
class Announcement extends Base {
  constructor(school, data) {
    super(school);
    this.title = data.title;
    this.class = data.class;
    this.content = data.content;
    this.date = data.date;
  }
}

module.exports = Announcement;