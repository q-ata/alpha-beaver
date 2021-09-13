const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: String,
  emblem: String,
  id: String,
  freeRegister: Boolean,
  requireName: Boolean
}, {collection: "meta"});

const roleSchema = new mongoose.Schema({
  id: Number,
  perms: Number,
  name: String,
  class: Number
}, {collection: "roles"});

const permissionSchema = new mongoose.Schema({
  overrides: Number,
  roles: [Number]
});

const userSchema = new mongoose.Schema({
  id: Number,
  pfp: String,
  firstName: String,
  lastName: String,
  perms: permissionSchema,
  classes: [Number]
}, {collection: "users"});

const classSchema = new mongoose.Schema({
  id: Number,
  name: String,
  background: String,
  desc: String,
  color: String
}, {collection: "classes"});

const standingSchema = new mongoose.Schema({
  user: Number,
  class: Number,
  perms: permissionSchema
}, {collection: "standings"});

const announcementSchema = new mongoose.Schema({
  class: Number,
  title: String,
  content: String,
  date: Number
}, {collection: "announcements"});

const accountSchema = new mongoose.Schema({
  username: String,
  password: String,
  id: Number,
  refreshToken: String
}, {collection: "accounts"});

const counterSchema = new mongoose.Schema({
  collec: String,
  next: Number
}, {collection: "counters"});

const moduleSchema = new mongoose.Schema({
  id: Number,
  class: Number,
  type: Number,
  data: {}
}, {collection: "content_modules"});

const pageSchema = new mongoose.Schema({
  id: Number,
  class: Number,
  modules: [Number],
  name: String
}, {collection: "pages"});

const assignSchema = new mongoose.Schema({
  id: Number,
  class: Number,
  title: String,
  desc: String,
  due: Number
}, {collection: "assignments"});

const submitSchema = new mongoose.Schema({
  id: Number,
  assignment: Number,
  class: Number,
  hash: String,
  type: String,
  name: String,
  author: Number
}, {collection: "submissions"});

const gradeSchema = new mongoose.Schema({
  assignment: Number,
  student: Number,
  grader: Number,
  score: Number,
  feedback: String,
  class: Number
}, {collection: "grades"});

const eventSchema = new mongoose.Schema({
  class: Number,
  title: String,
  content: String,
  allDay: Boolean,
  start: Number,
  end: Number
}, {collection: "events"});

module.exports = {
  schoolSchema,
  roleSchema,
  permissionSchema,
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
};