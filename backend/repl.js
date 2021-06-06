const repl = require("repl");
const School = require("./structs/School");
const mongoose = require("mongoose");
const config = require("./config.json");
process.env = {...process.env, ...config.env};
const f = async () => {
  const conn = await mongoose.createConnection(`${process.env.DB_PATH}/meta`, {useNewUrlParser: true, useUnifiedTopology: true});
  const schoolListSchema = new mongoose.Schema({
    id: String
  }, {collection: "schools"});
  const schools = new Map();
  const SchoolListModel = conn.model("SchoolListModel", schoolListSchema);
  const allSchools = await SchoolListModel.find().exec();
  const promises = [];
  for (const school of allSchools) {
    const s = new School(school.id);
    promises.push(s.init());
    schools.set(school.id, s);
  }
  await Promise.all(promises);
  conn.close();

  repl.start().context.schools = schools;
};
f();