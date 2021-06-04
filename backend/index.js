const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("colors");
const resolver = require("./resolver");
const mongoose = require("mongoose");
const config = require("./config.json");
process.env = {...process.env, ...config.env};
process.env.BUILD_PATH = path.join(__dirname, "..", "frontend", "build");
const School = require("./structs/School");
const app = express();
global.logger = {
  level: 1,
  setLevel: function(level) {
    this.level = level;
  },
  log: (msg, type, color = "reset") => {
    console.log(`[${type[color]}]: ${msg[color]}`);
  },
  def: function(msg) {
    this.log(msg, "INFO", "brightWhite");
  },
  info: function(msg) {
    this.log(msg, "INFO", "green");
  },
  debug: function(msg) {
    this.level > 1 && this.log(msg, "DEBUG", "brightYellow");
  },
  warn: function(msg) {
    this.log(msg, "WARN", "yellow");
  },
  error: function(msg) {
    this.log(msg, "ERROR", "red");
  }
};
global.error = (msg) => {
  return {error: true, msg};
};
logger.setLevel(2);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(process.env.BUILD_PATH));

const schools = new Map();
const authenticator = (req, res, next) => {
  const authData = req.header("Authorization");
  if (!authData || !authData.startsWith("Bearer ")) return res.status(400).send(error("Invalid or missing Authorization header."));
  const jwt = authData.slice(7);
  const payload = resolver.validateToken(jwt);
  if (!payload) return res.status(401).send(error("Invalid JWT provided."));
  const school = schools.get(payload.school);
  if (!school) return res.status(404).send(error("School ID not found."));
  const user = payload.user;
  req.school = school;
  req.user = user;
  next();
};

const schoolMapper = (req, res, next) => {
  req.schools = schools;
  next();
};

const api = require("./api/api_config.json");
const allEndpoints = [];
resolver.resolve(api, "", allEndpoints);
app.use("/api", schoolMapper);
for (const ep of allEndpoints) {
  if (ep.auth) app.use(ep.path, authenticator);
  app[ep.method](ep.path, ep.func);
  logger.def(`Created endpoint ${ep.method.toUpperCase()} ${ep.path}`);
}

app.listen(process.env.PORT, () => {
  logger.def(`Started server on port ${process.env.PORT}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(process.env.BUILD_PATH, "index.html"));
});

const loadSchools = async () => {
  logger.def("Starting server...");
  const conn = await mongoose.createConnection(`${process.env.DB_PATH}/meta`, {useNewUrlParser: true, useUnifiedTopology: true});
  logger.def("Connected to meta database");
  const schoolListSchema = new mongoose.Schema({
    id: String
  }, {collection: "schools"});
  const SchoolListModel = conn.model("SchoolListModel", schoolListSchema);
  const allSchools = await SchoolListModel.find().exec();
  logger.def(`Got list of ${allSchools.length} schools`);
  const promises = [];
  for (const school of allSchools) {
    const s = new School(school.id);
    promises.push(s.init());
    schools.set(school.id, s);
  }
  await Promise.all(promises);
  logger.def("All schools initialized");
  conn.close();
};
loadSchools();