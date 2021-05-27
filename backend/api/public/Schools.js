const Route = require("../../structs/Route");

class Schools extends Route {
  constructor() {
    super("get", "schools");
  }

  async execute(req, res) {
    const q = req.query.q || "";
    const schools = Array.from(req.schools).map((s) => {
      return {id: s[1].id, name: s[1].name, emblem: s[1].emblem, requireName: s[1].requireName};
    });
    const result = schools.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
    res.status(200).json({schools: result});
  }
}

module.exports = Schools;