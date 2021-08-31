const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  if (!req.query.userID) req.query.userID = req.user;
  const perms = await req.school.getClassPermissions(req.query.userID, req.params.classID);
  res.status(200).json({bitset: perms.binPerms, list: perms.all()});
};

module.exports = execute;