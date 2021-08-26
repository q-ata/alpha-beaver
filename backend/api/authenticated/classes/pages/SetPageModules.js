const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(req.body, "modules")) return res.status(400).json(error("Modules field missing."));
  const vals = req.body.modules.map((m) => parseInt(m));
  if (!vals || vals.some(isNaN)) return res.status(400).json(error("Modules field is malformed."));
  const currentPage = await req.school.getPage(req.params.pageID);
  if (!currentPage) return res.status(404).json(error("Page ID does not exist."));
  req.school.setPage(req.params.pageID, {id: currentPage.id, class: currentPage.class, name: currentPage.name, modules: vals});
  res.status(200).json({ok: true});
};

module.exports = execute;