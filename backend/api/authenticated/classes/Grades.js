const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  const grades = await req.school.getGrades({class: parseInt(req.params.classID), student: req.user});
  grades.forEach((a) => delete a.school);
  res.status(200).json({grades});
};

module.exports = execute;