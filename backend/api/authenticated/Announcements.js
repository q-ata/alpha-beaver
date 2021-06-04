const execute = async (req, res) => {
  // TODO: Check user has permission to access class announcements
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const ann = await req.school.getAnnouncements({class: req.params.classID}, {limit: req.query.limit || 8});
  ann.forEach((a) => delete a.school);
  res.status(200).json({announcements: ann});
};

module.exports = execute;