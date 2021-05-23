const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("./build"));

const files = fs.readdirSync("./routes");
for (const route of files) {
  const Route = require(`./routes/${route}`);
  const instance = new Route();
  app[instance.method](instance.path, instance.execute);
  console.log(`Loaded ${route}`);
}
app.listen(PORT, () => {
  console.log("ok");
});