const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const pages = await req.school.getPages({class: req.params.classID});
  const copy = [];
  pages.forEach((c) => copy.push({name: c.name, id: c.id, modules: c.modules}));
  copy.forEach((c) => delete c.school);
  res.status(200).json({pages: copy});
};

module.exports = execute;