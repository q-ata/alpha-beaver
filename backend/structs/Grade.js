const Base = require("./Base");
class Grade extends Base {
  constructor(school, data) {
    super(school);
    this.assignment = data.assignment;
    this.student = data.student;
    this.grader = data.grader;
    this.score = data.score;
    this.feedback = data.feedback;
    this.class = data.class;
  }
}

module.exports = Grade;