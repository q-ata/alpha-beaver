const {
  schoolSchema,
  roleSchema,
  userSchema,
  classSchema,
  standingSchema,
  announcementSchema,
  accountSchema,
  counterSchema,
  moduleSchema,
  pageSchema,
  assignSchema,
  submitSchema,
  gradeSchema,
  eventSchema
} = require("./schemas");

const mongoose = require("mongoose");
const UserCacheManager = require("./UserCacheManager");
const RoleCacheManager = require("./RoleCacheManager");
const ClassCacheManager = require("./ClassCacheManager");
const AnnouncementCacheManager = require("./AnnouncementCacheManager");
const ModuleCacheManager = require("./ModuleCacheManager");
const PageCacheManager = require("./PageCacheManager");
const EventCacheManager = require("./EventCacheManager");
const StandingCacheManager = require("./StandingCacheManager");
const AssignmentCacheManager = require("./AssignmentCacheManager");
const GradeCacheManager = require("./GradeCacheManager");
const Permissions = require("./Permissions");
const Base = require("./Base");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+{}:>?<;,./[]-=|";

class School extends Base {
  constructor(id) {
    super(null);
    this.id = id;
  }

  async init() {
    await this.setConnection();
    const schoolData = await this.models.SchoolModel.findOne({id: `${this.id}`}).exec();
    this.name = schoolData.name;
    this.emblem = schoolData.emblem;
    this.freeRegister = schoolData.freeRegister;
    this.requireName = schoolData.requireName;
    this.users = new UserCacheManager(this);
    this.roles = new RoleCacheManager(this);
    this.classes = new ClassCacheManager(this);
    this.announcements = new AnnouncementCacheManager(this);
    this.pages = new PageCacheManager(this);
    this.content_modules = new ModuleCacheManager(this);
    this.events = new EventCacheManager(this);
    this.standings = new StandingCacheManager(this);
    this.assignments = new AssignmentCacheManager(this);
    this.grades = new GradeCacheManager(this);
  }

  async setConnection() {
    const connection = await mongoose.createConnection(`${process.env.DB_PATH}/${this.id}`, {useNewUrlParser: true, useUnifiedTopology: true});
    this.models = {
      SchoolModel: connection.model("SchoolModel", schoolSchema),
      UserModel: connection.model("UserModel", userSchema),
      RoleModel: connection.model("RoleModel", roleSchema),
      ClassModel: connection.model("ClassModel", classSchema),
      StandingModel: connection.model("StandingModel", standingSchema),
      AnnouncementModel: connection.model("AnnouncementModel", announcementSchema),
      AccountModel: connection.model("AccountModel", accountSchema),
      CounterModel: connection.model("CounterModel", counterSchema),
      ModuleModel: connection.model("ContentModel", moduleSchema),
      PageModel: connection.model("PageModel", pageSchema),
      AssignmentModel: connection.model("AssignmentModel", assignSchema),
      SubmissionModel: connection.model("SubmissionModel", submitSchema),
      GradeModel: connection.model("GradeModel", gradeSchema),
      EventModel: connection.model("EventModel", eventSchema)
    };

    this.connection = connection;
    return connection;
  }

  async getItem(cm, filter, options = {force: false}) {
    if (options.force) this[cm].cache.delete(filter);
    const ret = await this[cm].get(filter, options);
    return ret;
  }

  async getUsers(filter = null, options) {
    const users = await this.getItem("users", filter, options);
    for (let i = 0; i < users.length; i++) {
      await users[i].loadStandings();
    }
    return users;
  }

  async getUser(filter, options) {
    return (await this.getUsers(filter, {...options, limit: 1}))[0];
  }

  async getRoles(filter = null, options) {
    return await this.getItem("roles", filter, options);
  }

  async getRole(filter, options) {
    return (await this.getRoles(filter, {...options, limit: 1}))[0];
  }

  async getClasses(filter = null, options) {
    return await this.getItem("classes", filter, options);
  }

  async getClass(filter, options) {
    return (await this.getClasses(filter, {...options, limit: 1}))[0];
  }

  async getAnnouncements(filter = null, options) {
    return await this.getItem("announcements", filter, options);
  }

  async addAnnouncement(ann) {
    const res = await this.models.AnnouncementModel.create({class: ann.classID, title: ann.title, content: ann.content, date: ann.date});
    return res;
  }

  async getEvents(filter = null, options) {
    return await this.getItem("events", filter, options);
  }

  async addEvent(event) {
    const res = await this.models.EventModel.create({
      class: event.classID, title: event.title, content: event.content, 
      allDay: event.allDay, start: event.start, end: event.end
    });
    return res;
  }
  
  async getStandings(filter = null, options) {
    return await this.getItem("standings", filter, options);
  }

  async getStanding(filter, options) {
    return (await this.getStandings(filter, {...options, limit: 1}))[0];
  }

  async getPages(filter = null, options) {
    return await this.getItem("pages", filter, options);
  }

  async getPage(filter, options) {
    return (await this.getPages(filter, {...options, limit: 1}))[0];
  }

  async setPage(pageID, value) {
    const res = await this.models.PageModel.updateOne({id: pageID}, value).exec();
    // Since this is an update operation we must invalidate the cache
    this.getPage(pageID, {force: true});
    return res;
  }

  async getModules(filter = null, options) {
    return await this.getItem("content_modules", filter, options);
  }

  async getModule(filter, options) {
    return (await this.getModules(filter, {...options, limit: 1}))[0];
  }

  async getAssignments(filter = null, options) {
    return await this.getItem("assignments", filter, options);
  }

  async getAssignment(filter, options) {
    return (await this.getAssignments(filter, {...options, limit: 1}))[0];
  }

  async getGrades(filter = null, options) {
    return await this.getItem("grades", filter, options);
  }

  async getGrade(filter, options) {
    return (await this.getGrades(filter, {...options, limit: 1}))[0];
  }

  async addSubmissions(assignment, author, submissions) {
    if (!Array.isArray(submissions)) return this.addSubmissions([submissions]);
    const res = await this.models.SubmissionModel.find({assignment, author}).exec();
    for (const r of res) fs.unlink(`./uploads/${r.hash}`, () => {});
    await this.models.SubmissionModel.deleteMany({_id: res.map((r) => r._id)}).exec();
    const data = await this.models.CounterModel.findOne({collec: "submissions"}, {next: 1}).exec();
    let id = data.next;
    const promises = [];
    const ids = [];
    for (const submit of submissions) {
      ids.push(id);
      promises.push(this.models.SubmissionModel.create({
        id: id++, 
        assignment,
        author,
        ...submit
      }));
    }
    promises.push(this.models.CounterModel.updateOne({collec: "submissions"}, {next: id + 1}).exec());
    await Promise.all(promises);
    return ids;
  }

  async getGlobalPermissions(userID, options) {
    const user = await this.getUser(userID, options);
    const roles = await this.getRoles(user.perms.roles, options);
    // console.log(user, roles);
    return new Permissions(roles.reduce((a, b) => a.perms | b.perms, 0) | user.perms.overrides);
  }

  async getClassPermissions(userID, classID, options) {
    const standing = await this.getStanding({user: userID, class: classID}, options);
    if (!standing) return new Permissions(0);
    const roles = await this.getRoles(standing.perms.roles, options);
    return new Permissions(roles.reduce((a, b) => a.perms | b.perms, 0) | standing.perms.overrides); 
  }

  async addModule(mod) {
    const data = await this.models.CounterModel.findOne({collec: "content_modules"}, {next: 1}).exec();
    const id = data.next;
    // TODO: Apply this promise optimization wherever we can throughout the codebase
    const p1 = this.models.ModuleModel.create({id, class: mod.class, type: mod.type, data: mod.data});
    // TODO: There is a specialized increment oeprator we can use here
    const p2 = this.models.CounterModel.updateOne({collec: "content_modules"}, {next: id + 1}).exec();
    await Promise.all([p1, p2]);
    return id;
  }

  async setModules(modules) {
    // Assume data has been sanitized and is valid.
    const writes = modules.map((m) => {
      return {
        updateOne: {
          "filter": {id: m.id},
          "update": m
        }
      };
    });
    return this.models.ModuleModel.bulkWrite(writes);
  }

  async createAccount(username, plaintext, firstName = "", lastName = "") {
    const password = await bcrypt.hash(plaintext, 10);
    const data = await this.models.CounterModel.findOne({collec: "users"}, {next: 1}).exec();
    const id = data.next;
    await this.models.AccountModel.create({username, password, id, refreshTokens: [], expires: 0});
    await this.models.UserModel.create({id, firstName, lastName, classes: [], perms: {overrides: 0, roles: []}});
    await this.models.CounterModel.updateOne({collec: "users"}, {next: id + 1});
    return id;
  }
  
  async validateAccount(user, pass) {
    const query = await this.models.AccountModel.findOne({username: user}).exec();
    if (!query) return -1;
    const hash = await bcrypt.compare(pass, query.password);
    return hash ? query.id : -1;
  }

  async validate() {
    const allUsers = await this.getUsers(null);
    const set = new Set();
    for (const user of allUsers) set.add(user.id);
    logger.def("Checking uniqueness of user IDs...");
    if (set.size === allUsers.length) logger.info("All user IDs are unique.");
    else logger.error(`Duplicate user IDs found, total of ${allUsers.length} entries with ${set.size} unique IDs.`);

    set.clear();
    const classes = await this.getClasses(null);
    for (const clazz of classes) set.add(clazz.id);
    logger.def("Checking uniqueness of class IDs...");
    if (set.size === classes.length) logger.info("All class IDs are unique.");
    else logger.error(`Duplicate class IDs found, total of ${classes.length} entries with ${set.size} unique IDs.`);

    set.clear();
    const roles = await this.getRoles(null);
    for (const role of roles) set.add(role.id);
    logger.def("Checking uniqueness of role IDs...");
    if (set.size === roles.length) logger.info("All role IDs are unique.");
    else logger.error(`Duplicate role IDs found, total of ${roles.length} entries with ${set.size} unique IDs.`);

  }

  randomString(length) {
    const result = [];
    
    const charactersLength = CHARACTERS.length;

    for (let i = 0; i < length; ++i) {
      result.push(CHARACTERS.charAt(Math.floor(Math.random() * charactersLength)));
    }

    return result.join("");
  }

  async getRefreshToken(user) {
    let rToken = await this.models.AccountModel.findOne({id: user}, {refreshToken: 1}).exec();
    if (!rToken || !rToken.length) {
      rToken = this.randomString(30);
      await this.models.AccountModel.updateOne({id: user}, {$set: {refreshToken: bcrypt.hashSync(rToken, 10)}}).exec();
    }
    return rToken;
  }

  async validateRefreshToken(rToken, user) {
    const fetched = await this.models.AccountModel.findOne({id: user}, {refreshToken: 1}).exec();
    return bcrypt.compareSync(rToken, fetched.refreshToken);
  }

}

module.exports = School;