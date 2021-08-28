const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  // TODO: Should do some data format validation here (add some default settings)
  if (!Object.prototype.hasOwnProperty.call(req.body, "class")) return res.status(400).json(error("Class field missing."));
  if (!Object.prototype.hasOwnProperty.call(req.body, "type")) return res.status(400).json(error("Type field missing."));
  if (!Object.prototype.hasOwnProperty.call(req.body, "data")) return res.status(400).json(error("Data field missing."));
  const id = await req.school.addModule(req.body);
  res.status(200).json({id});
};

module.exports = execute;