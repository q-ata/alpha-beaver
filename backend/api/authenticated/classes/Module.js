const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const filter = {class: req.params.classID};
  if (req.query.moduleID) {
    const arr = req.query.moduleID.split(",").map(Number);
    if (arr.some(isNaN)) {
      res.status(400).json(error("Malformed moduleID filter."));
      return;
    }
    filter.id = {$in: arr};
  }
  const content = await req.school.getModules(filter);
  const copy = [];
  content.forEach((c) => copy.push(Object.assign({}, c)));
  copy.forEach((c) => delete c.school);
  res.status(200).json({content_modules: copy});
};

module.exports = execute;