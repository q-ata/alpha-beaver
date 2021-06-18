const resolver = require("../../resolver");

const execute = async (req, res) => {
  const body = req.body;
  if (!body.user || !body.school) return res.status(400).json(error("No user ID or school ID provided."));

  const school = req.schools.get(body.school);
  if (!school) return res.status(404).json(error("Invalid school ID provided."));
  
  const user = await school.getUser(body.user);
  if (!user) return res.status(404).json(error("Invalid user ID provided."));
  
  if (!req.cookies.refresh_token) return res.status(400).json(error("No refresh token provided."));
  const isValid = await school.validateRefreshToken(req.cookies.refresh_token, body.user);
  if (!isValid) return res.status(403).json(error("Invalid Refresh Token"));
  
  const jwt = resolver.generateToken(body.user, body.school);
  logger.debug(`User authenticated and generated token ${jwt}`);
  res.status(200).json({token: jwt});
};
  
module.exports = execute;
