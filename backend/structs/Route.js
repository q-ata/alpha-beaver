class Route {
  constructor(method, path) {
    this.method = method;
    this.path = path;
  }

  async execute(req, res) {

  }
}

module.exports = Route;