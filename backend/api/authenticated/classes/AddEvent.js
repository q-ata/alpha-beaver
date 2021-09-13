const execute = async (req, res) => {
    const body = req.body;
    if (!body.title) return res.status(400).json(error("No title provided."));
    logger.debug(`Request made to addevent endpoint`);
    body.classID = req.params.classID;
    if (!body.start || !body.end) return res.status(400).json(error("Start or end date missing."));
    const user = await req.school.getUser(req.user);
    if (!user) {
      logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
      res.status(500).json(error("Internal error."));
      return;
    }
    const event = await req.school.addEvent(body);
    res.status(200).json({event});
  };
  
  module.exports = execute;