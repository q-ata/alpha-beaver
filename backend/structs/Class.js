const Base = require("./Base");
class Class extends Base {
  constructor(school, data) {
    super(school);
    this.id = data.id;
    this.name = data.name;
    this.background = data.background;
    this.desc = data.desc;
    this.color = data.color;
  }

  async getUsers(filter = null, options = {key: "id"}) {
    if (typeof filter !== "object") {
      filter = {[options.key]: filter};
    }
    if (typeof filter[Symbol.iterator] === "function") filter = {[options.key]: {$in: filter}};
    filter.classes = {$in: [this.id]};
    return await this.school.getUsers(filter, options);
  }

  async getUser(filter, options = {key: "id"}) {
    return (await this.getUsers(filter, {...options, limit: 1}))[0];
  }

  async getRoles(filter = null, options = {key: "id"}) {
    if (typeof filter !== "object") {
      filter = {[options.key]: filter};
    }
    if (typeof filter[Symbol.iterator] === "function") filter = {[options.key]: {$in: filter}};
    filter.classes = {$in: [this.id]};
    return await this.school.getRoles(filter, options);
  }

  async getRole(filter, options = {key: "id"}) {
    return (await this.getUsers(filter, {...options, limit: 1}))[0];
  }

  async getAnnouncements(filter, options = {limit: 5}) {
    return await this.school.getAnnouncements({...filter, class: this.id}, options);
  }
  
}

module.exports = Class;