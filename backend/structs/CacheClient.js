const Base = require("./Base");

class CacheClient extends Base {
  constructor(school) {
    super(school);
  }
  async getItem(cm, filter, options = {force: false}) {
    if (options.force) this[cm].cache.delete(filter);
    const ret = await this[cm].get(filter, options);
    return ret;
  }
}

module.exports = CacheClient;