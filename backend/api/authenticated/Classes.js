const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const classes = await req.school.getClasses(user.classes);
  classes.forEach((c) => delete c.school);
  res.status(200).json({classes});
};

module.exports = execute;