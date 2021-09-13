const Event = require("./Event");
const CacheManager = require("./CacheManager");

class EventCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Event, "EventModel", timeout);
  }
}

module.exports = EventCacheManager;