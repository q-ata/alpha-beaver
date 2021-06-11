const resolver = require("../../resolver");

const execute = async (req, res) => {
  const body = req.body;
  if (!body.username || !body.password) return res.status(400).json(error("No username or password provided."));
  logger.debug(`Request made to login endpoint with username ${body.username} and password ${body.password}`);
  if (!body.school) return res.status(400).json(error("No school ID provided."));
  const school = req.schools.get(body.school);
  if (!school) return res.status(404).json(error("No school by that ID was found."));
  const userID = await school.validateAccount(body.username, body.password);
  if (userID === -1) return res.status(401).json(error("Incorrect username or password."));
  logger.debug(`Account credentials validated for school ID ${school.id} named ${school.name}`);
  const jwt = resolver.generateToken(userID, school.id);
  const exp = req.body.rememberMe ? new Date(Date.now() + 1000*60*60*24*365) : new Date(Date.now() + 1000*60*60*24);
  const rToken = school.randomString(30);
  res.cookie("refresh_token", rToken, {httpOnly: true, sameSite: "Strict", expires: exp});
  logger.debug(`User authenticated and generated token ${jwt}`);
  await school.addRefreshToken(rToken, exp, userID);
  res.status(200).json({token: jwt, id: userID});
};

module.exports = execute;