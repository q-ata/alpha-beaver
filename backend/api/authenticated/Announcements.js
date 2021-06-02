
const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const ann = await req.school.getAnnouncements({class: {$in: user.classes}}, {limit: 8});
  ann.forEach((a) => delete a.school);
  res.status(200).json({announcements: ann});
};

module.exports = execute;