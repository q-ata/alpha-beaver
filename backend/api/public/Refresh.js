const resolver = require("../../resolver");

const execute = async (req, res) => {
    const body = req.body;
    if (!body.user || !body.school) return res.status(400).json(error("No user ID or school ID provided."));
    logger.debug(`Request made to login endpoint with user ID ${body.user} and password ${body.password}`);

    const school = req.schools.get(body.school);
    if (!school) return res.status(404).json(error("Invalid school ID provided."));
    
    const user = await school.getUser(body.user);
    if (!user) return res.status(404).json(error("Invalid user ID provided."));
    
    const isValid = school.validateRefreshToken(req.cookies.refresh_token);
    if (!isValid) res.status(403).json(error("Invalid Refresh Token"));

    const jwt = resolver.generateToken(body.user, body.school);

    logger.debug(`User authenticated and generated token ${jwt}`);
    res.status(200).json({token: jwt});
  };
  
  module.exports = execute;