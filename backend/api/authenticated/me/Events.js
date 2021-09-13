const execute = async (req, res) => {
    const user = await req.school.getUser(req.user);
    if (!user) {
      logger.error(`INVALID USER ID PROVIDED TO USER ENDPOINT FOR SCHOOL ${req.school}: ${req.user}`);
      res.status(500).json(error("Internal error."));
      return;
    }
    
    const events = await user.getEvents({limit: req.params.limit || 8});
    const copy = [];
    events.forEach((a) => copy.push(Object.assign({}, a)));
    copy.forEach((c) => delete c.school);
    res.status(200).json({events: copy});
  };
  
  module.exports = execute;