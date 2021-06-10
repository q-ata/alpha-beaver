const {
  schoolSchema,
  roleSchema,
  userSchema,
  classSchema,
  standingSchema,
  announcementSchema,
  accountSchema,
  counterSchema
} = require("./schemas");
const mongoose = require("mongoose");
const UserCacheManager = require("./UserCacheManager");
const RoleCacheManager = require("./RoleCacheManager");
const ClassCacheManager = require("./ClassCacheManager");
const AnnouncementCacheManager = require("./AnnouncementCacheManager");
const Base = require("./Base");
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
      CounterModel: connection.model("CounterModel", counterSchema)
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

  async addRefreshToken(rToken, exp, user) {
    this.models.AccountModel.updateOne({id: user}, {$push: {refreshTokens: {token: bcrypt.hashSync(rToken, 10), expires: exp}}}).exec();
  }

  async validateRefreshToken(rToken, user) {
    const rTokens = await this.models.AccountModel.findOne({id: user}, {refreshTokens: 1}).exec();
    let flag = false;
    for (const token of rTokens.refreshTokens) {
      if (Date.now() > token.expires) {
        this.models.AccountModel.updateOne({id: user}, {$pull: {refreshTokens: {token: token.token}}}).exec();
      }
      else if (bcrypt.compareSync(rToken, token.token)) {
        flag = true;
      }
    }
    return flag;
  }

}

module.exports = School;