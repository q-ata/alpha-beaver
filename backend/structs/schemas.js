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
  classes: [Number],
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
  page: Number,
  type: Number,
  data: String
}, {collection: "content_modules"});

const pageSchema = new mongoose.Schema({
  id: Number,
  class: Number,
  modules: [Number]
}, {collection: "pages"});

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
  pageSchema
};