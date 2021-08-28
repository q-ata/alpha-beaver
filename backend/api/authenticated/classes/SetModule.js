const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  // TODO: Should do some data format validation here (add some default settings)
  if (!Object.prototype.hasOwnProperty.call(req.body, "modules")) return res.status(400).json(error("Modules field missing."));
  const modules = req.body.modules;
  if (!Array.isArray(modules)) return res.status(400).json(error("Malformed modules property, expected array."));
  const ids = modules.map((m) => m.id);
  // If the id is not a number or is not an integer
  if (ids.some((id) => typeof id !== "number" || id % 1 !== 0)) return res.status(400).json(error("Invalid ID provided."));
  // TODO: Should use constants instead of magic numbers
  if (modules.some((m) => typeof m.type !== "number" || m.type % 1 !== 0 || m.type < 0 || m.type > 2)) return res.status(400).json(error("Invalid type provided,"));
  // TODO: Specific module validation based on type
  const resp = await req.school.setModules(modules);
  res.status(200).json(resp);
};

module.exports = execute;