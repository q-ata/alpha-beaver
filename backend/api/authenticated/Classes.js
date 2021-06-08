const execute = async (req, res) => {
  // TODO: Check user has permission to access class.
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const clazz = (await req.school.getClasses(req.params.classID))[0];
  delete clazz.school;
  res.status(200).json(clazz);
};

module.exports = execute;