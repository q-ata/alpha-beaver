const fs = require("fs");
const path = require("path");

const loadEndpoints = (folder) => {
  const dest = path.join(__dirname, folder);
  const files = fs.readdirSync(dest);
  const endpoints = [];
  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    endpoints.push(require(path.join(dest, file)));
  }
  return endpoints;
};

module.exports = loadEndpoints;