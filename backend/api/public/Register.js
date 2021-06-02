const execute = async (req, res) => {
  const body = req.body;
  if (!body.username || !body.password) return res.status(400).json(error("No username or password provided."));
  logger.debug(`Request made to register endpoint with username ${body.username} and password ${body.password}`);
  if (!body.school) return res.status(400).json(error("No school ID provided."));
  const school = req.schools.get(body.school);
  if (!school) return res.status(404).json(error("No school by that ID was found."));
  if (!school.freeRegister) return res.status(403).json(error("This school does not allow registration. Contact your administrator or teacher to setup an account."));
  logger.debug(`Selected school ID ${school.id} named ${school.name} does allow registration.`);
  const firstName = body.firstName || "";
  const lastName = body.lastName || "";
  if (school.requireName && (!firstName.length || !lastName.length)) return res.status(400).json(error("No first and/or last name provided."));
  const exists = await school.models.AccountModel.findOne({username: body.username}).exec();
  if (exists) return res.status(401).json(error("That username is already taken."));
  const id = await school.createAccount(body.username, body.password, firstName, lastName);
  logger.debug(`Created account with id ${id}`);
  res.status(200).json({id});
};

module.exports = execute;