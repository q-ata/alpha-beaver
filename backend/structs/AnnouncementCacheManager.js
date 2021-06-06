const Announcement = require("./Announcement");
const CacheManager = require("./CacheManager");

class AnnouncementCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Announcement, "AnnouncementModel", timeout);
  }
}

module.exports = AnnouncementCacheManager;