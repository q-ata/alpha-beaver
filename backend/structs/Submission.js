const Base = require("./Base");
class Submission extends Base {
  constructor(school, data) {
    super(school);
    this.id = data.id;
    this.assignment = data.assignment;
    this.class = data.class;
    this.hash = data.hash;
    this.type = data.type;
    this.name = data.name;
    this.author = data.author;
  }
}

module.exports = Submission;