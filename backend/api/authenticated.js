const express = require("express");
const router = express.Router();
const loadEndpoints = require("./loadEndpoints");
const Route = require("../structs/Route");

const create = (schools) => {
  router.use((req, res, next) => {
    const authData = req.header("Authorization");
    if (!authData || !authData.startsWith("Bearer ")) return res.status(400).send(error("Invalid or missing Authorization header."));
    const jwt = authData.slice(7);
    const payload = Route.validateToken(jwt);
    if (!payload) return res.status(401).send(error("Invalid JWT provided."));
    const school = schools.get(payload.school);
    if (!school) return res.status(404).send(error("School ID not found."));
    const user = payload.user;
    req.school = school;
    req.user = user;
    next();
  });
  const endpoints = loadEndpoints("authenticated");
  for (const Endpoint of endpoints) {
    const ep = new Endpoint();
    router[ep.method](`/${ep.path}`, ep.execute);
  }
  return router;
};

module.exports = {create};