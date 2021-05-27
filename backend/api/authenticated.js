const express = require("express");
const router = express.Router();
const base64url = require("base64url");

const create = (schools) => {
  router.use((req, res, next) => {
    const authData = req.header("Authorization");
    if (!authData || !authData.startsWith("Bearer ")) return next();
    const jwt = authData.slice(7);
    const payloadEncoded = jwt.split(".")[1];
    const payload = JSON.parse(base64url.decode(payloadEncoded));
    const school = schools.get(school);
    if (!school) res.status(404).send(error("School ID not found."));

  });
  return router;
};

module.exports = {create};