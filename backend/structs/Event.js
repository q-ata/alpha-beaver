const Base = require("./Base");
class Event extends Base {
  constructor(school, data) {
    super(school);
    this.class = data.class;
    this.title = data.title;
    this.content = data.content;
    this.start = data.start;
    this.end = data.end;
  }
}

module.exports = Event;