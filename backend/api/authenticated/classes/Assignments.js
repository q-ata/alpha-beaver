const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const ass = await req.school.getAssignments({class: parseInt(req.params.classID)});
  ass.forEach((a) => delete a.school);
  res.status(200).json({assignments: ass});
};

module.exports = execute;