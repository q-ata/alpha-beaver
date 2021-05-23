const {
  schoolSchema,
  roleSchema,
  userSchema,
  classSchema,
  standingSchema,
  accountSchema
} = require("./schemas");
require("colors");
const mongoose = require("mongoose");
const UserCacheManager = require("./UserCacheManager");
const RoleCacheManager = require("./RoleCacheManager");
const ClassCacheManager = require("./ClassCacheManager");
const Base = require("./Base");
const bcrypt = require('bcryptjs');


global.logger = {
  log: (msg, type, color = "reset") => {
    console.log(`[${type[color]}]: ${msg[color]}`);
  },
  def: function(msg) {
    this.log(msg, "INFO");
  },
  info: function(msg) {
    this.log(msg, "INFO", "green");
  },
  warn: function(msg) {
    this.log(msg, "WARN", "yellow");
  },
  error: function(msg) {
    this.log(msg, "ERROR", "red");
  }
};
// Disable eslint errors.
let logger = global.logger;

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
    this.users = new UserCacheManager(this);
    this.roles = new RoleCacheManager(this);
    this.classes = new ClassCacheManager(this);
  }

  async setConnection() {
    const connection = await mongoose.createConnection(`mongodb://localhost:27017/${this.id}`, {useNewUrlParser: true, useUnifiedTopology: true});
    this.models = {
      SchoolModel: connection.model("SchoolModel", schoolSchema),
      UserModel: connection.model("UserModel", userSchema),
      RoleModel: connection.model("RoleModel", roleSchema),
      ClassModel: connection.model("ClassModel", classSchema),
      StandingModel: connection.model("StandingModel", standingSchema),
      AccountModel: connection.model("AccountModel", accountSchema)
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

  async createAccount(user, pass, id) {
  
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(pass, salt);

    this.models.AccountModel.create({username: user, password: hashedPW, id: id});
    return id;
  }
  
  async validateAccount(user, pass) {
  
    // Load hash from your password DB.
    const query = await this.models.AccountModel.findOne({username: user});
    const hash = await bcrypt.compare(pass, query.password)

    if (hash) {
      // Return student id
      return query.id;
    }
  
    // Rejected
    return -1;
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
}

const util = require("util");

const print = (msg) => {
  console.log(util.inspect(msg, {depth: null}));
};

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, interval);
  });
};


const f = async () => {
  const s = new School("0016");
  await s.init();

  const data = await s.models.AccountModel.find();
  console.log(data);

  await s.createAccount("RyanChen1", "yes", 1);

  const id = await s.validateAccount("RyanChen1", "yes");
  console.log(id);

  /*
  await s.validate();


  //console.log(s);
  const u = await s.getUsers({firstName: {$regex: "T"}}, {limit: 3});
  u.forEach((a) => a.print());
  console.log((new Error()).stack)
  // const c = await s.getClass(u.classes[0]);
  // console.log(c);
  // const st = await u.getStanding();
  /*
  let totalPerms = 0;
  //console.log(`Override perms: ${format(u.perms.overrides)}`);
  totalPerms |= u.perms.overrides;
  for (const roleId of u.perms.roles) {
    const role = await s.getRole(roleId);
    totalPerms |= role.perms;
    //console.log(`Role perms: ${format(role.perms)}`);
    //console.log(`Override perms: ${format(totalPerms)}`);
  }
  const c = await s.getClass(1);
  //console.log(c);*/
};
f();