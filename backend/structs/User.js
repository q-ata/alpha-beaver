const AggregatedPermissions = require("./AggregatedPermissions");
const Base = require("./Base");

class User extends Base {
  constructor(school, data) {
    super(school);
    this.id = data.id;
    this.pfp = data.pfp;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.perms = new AggregatedPermissions(data.perms);
    this.classes = data.classes;
  }

  async loadStandings() {
    this.standings = await this.school.models.StandingModel.find({user: this.id});
  }

}

module.exports = User;