const jwt = require("jsonwebtoken");
const Permissions = require("./structs/Permissions");

class Endpoint {
  constructor(method, path, func) {
    this.method = method;
    this.path = path;
    this.func = func;
  }
}

const resolve = (api, cPath, endpoints) => {
  const path = `${cPath}/${api.path || api.name}`;
  if (api.query) {
    const ep = new Endpoint(api.query.method, path, require(`./${api.query.dest}`));
    if (api.query.method === "post") ep.body = api.query.body;
    if (api.query.auth) ep.auth = true;
    if (api.query.perms !== undefined) ep.perms = new Permissions(api.query.perms);
    endpoints.push(ep);
  }
  if (api.sub) {
    for (const sub of api.sub) {
      resolve(sub, path, endpoints);
    }
  }
};

const generateToken = (user, school) => {
  return jwt.sign({user, school}, process.env.SECRET_KEY, {expiresIn: 900});
};

const validateToken = (token) => {

  const privateKey = process.env.SECRET_KEY;

  let decoded;
  try {
    decoded = jwt.verify(token, privateKey);
  }
  catch (err) {
    logger.debug(`Failed to authenticate token ${token}`);
    return false;
  }

  if (!decoded.user || !decoded.school) {
    logger.error(`INVALID JWT PAYLOAD: ${token}`);
    return false;
  }

  return decoded;
};

module.exports = {resolve, generateToken, validateToken};