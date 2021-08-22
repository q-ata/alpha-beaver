const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const page = await req.school.getPage(req.params.pageID);
  delete page.school;
  res.status(200).json(page);
};

module.exports = execute;