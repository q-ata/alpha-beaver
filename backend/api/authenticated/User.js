const execute = async (req, res) => {
  // TODO: Check for permissions to get requested user.
  const user = await req.school.getUser(req.params.userID);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  delete user.school;
  res.status(200).json(user);
};

module.exports = execute;