const Base = require("./Base");

class CacheManager extends Base {
  constructor(school, Container, model, timeout) {
    super(school);
    this.cache = new Map();
    this.timeout = timeout;
    this.Container = Container;
    this.model = school.models[model];
    this.school = school;
  }

  addCache(entries) {
    for (const e of entries) this.cache.set(e.id, [new this.Container(this.school, e), setTimeout(() => this.cache.delete(e.id), this.timeout)]);
  }

  async get(filter, {key = "id", limit = 0}) {
    if (filter === null) {
      const all = await this.model.find().exec();
      this.addCache(all);
      return all.map((item) => new this.Container(this.school, item));
    }
    if (typeof filter !== "object") {
      let item;
      if (key === "id" && (item = this.cache.get(filter))) {
        clearTimeout(item[1]);
        item[1] = setTimeout(() => this.cache.delete(filter), this.timeout);
        return [item[0]];
      }
      filter = {[key]: filter};
    }
    else if (typeof filter[Symbol.iterator] === "function") filter = {[key]: {$in: filter}};
    const ret = await this.model.find(filter).limit(limit).exec();
    this.addCache(ret);
    return ret.map((item) => new this.Container(this.school, item));
  }
}

module.exports = CacheManager;