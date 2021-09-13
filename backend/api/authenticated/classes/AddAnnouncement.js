const execute = async (req, res) => {
  const body = req.body;
  if (!body.title || !body.content) return res.status(400).json(error("No title or content provided."));
  logger.debug(`Request made to addannouncement endpoint`);
  body.classID = req.params.classID;
  if (!body.date) return res.status(400).json(error("No date provided."));
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const announce = await req.school.addAnnouncement(body);
  res.status(200).json({announce});
};

module.exports = execute;