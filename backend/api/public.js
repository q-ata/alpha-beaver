const express = require("express");
const loadEndpoints = require("./loadEndpoints");
const router = express.Router();

const create = (schools) => {
  router.use((req, res, next) => {
    req.schools = schools;
    next();
  });
  const endpoints = loadEndpoints("public");
  for (const Endpoint of endpoints) {
    const ep = new Endpoint();
    router[ep.method](`/${ep.path}`, ep.execute);
  }
  return router;
};

module.exports = {create};