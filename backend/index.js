const express = require("express");
const cors = require("cors");
const path = require("path");
require("colors");
const mongoose = require("mongoose");
const public = require("./api/public");
const authenticated = require("./api/authenticated");
const config = require("./config.json");
process.env = {...process.env, ...config.env};
process.env.BUILD_PATH = path.join(__dirname, "..", "frontend", "build");
const School = require("./structs/School");
const app = express();
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
global.error = (msg) => {
  return {error: true, msg};
};

app.use(cors());
app.use(express.json());
app.use(express.static(process.env.BUILD_PATH));

const schools = new Map();
app.use("/api", public.create(schools));
app.use("/api", authenticated.create(schools));

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