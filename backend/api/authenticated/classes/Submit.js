const execute = async (req, res) => {
  const user = await req.school.getUser(req.user);
  if (!user) {
    logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
    res.status(500).json(error("Internal error."));
    return;
  }
  if (isNaN(parseInt(req.query.assignID))) return res.status(400).json(error("Invalid or missing assignment ID."));
  const submit = req.files.submissions.map((f) => {
    return {
      class: req.params.classID,
      hash: f.filename,
      type: f.mimetype,
      name: f.originalname
    };
  });
  req.school.addSubmissions(req.query.assignID, req.user, submit);
  res.status(200).json({ok: true});
};

module.exports = execute;