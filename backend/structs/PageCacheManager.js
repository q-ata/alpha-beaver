const Page = require("./Page");
const CacheManager = require("./CacheManager");

class PageCacheManager extends CacheManager {
  constructor(school, timeout = 3600000) {
    super(school, Page, "PageModel", timeout);
  }
}

module.exports = PageCacheManager;