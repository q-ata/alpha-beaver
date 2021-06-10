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

const refreshSchema = new mongoose.Schema({
  token: String,
  expiry: Number
});

const accountSchema = new mongoose.Schema({
  username: String,
  password: String,
  id: Number,
  expires: Number,
  refreshTokens: [refreshSchema]
}, {collection: "accounts"});

const counterSchema = new mongoose.Schema({
  collec: String,
  next: Number
}, {collection: "counters"});

module.exports = {
  schoolSchema,
  roleSchema,
  permissionSchema,
  userSchema,
  classSchema,
  standingSchema,
  announcementSchema,
  accountSchema,
  counterSchema
};