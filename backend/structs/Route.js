const jwt = require("jsonwebtoken");

class Route {
  constructor(method, path) {
    this.method = method;
    this.path = path;
  }

  async execute() {

  }

  static generateToken(user, school) {
    return jwt.sign({user, school}, process.env.SECRET_KEY, {expiresIn: 900});
  }

  static validateToken(token) {

    const privateKey = process.env.SECRET_KEY;

    let decoded;
    try {
      decoded = jwt.verify(token, privateKey);
    }
    catch (err) {
      console.log(err);
      return false;
    }

    if (!decoded.user || !decoded.school) {
      logger.error(`INVALID JWT PAYLOAD: ${token}`);
      return false;
    }

    return decoded;
  }
}

module.exports = Route;