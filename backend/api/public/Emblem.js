const Route = require("../../structs/Route");

class Schools extends Route {
  constructor() {
    super("get", "emblem");
  }

  async execute(req, res) {
    const q = req.query.q || "";
    const schools = Array.from(req.schools).map((s) => {
      return {emblem: s[1].emblem, name: s[1].name};
    });
    const result = schools.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
    res.status(200).json({url: result});
  }
}

module.exports = Schools;