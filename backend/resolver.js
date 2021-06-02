class Endpoint {
  constructor(method, path, func) {
    this.method = method;
    this.path = path;
    this.func = func;
  }
}

const resolve = (api, cPath, endpoints) => {
  const path = `${cPath}/${api.path || api.name}`;
  if (api.query) {
    const ep = new Endpoint(api.query.method, path, require(`./${api.query.dest}`));
    if (api.query.method === "post") ep.body = api.query.body;
    if (api.query.auth) ep.auth = true;
    endpoints.push(ep);
  }
  if (api.sub) {
    for (const sub of api.sub) {
      resolve(sub, path, endpoints);
    }
  }
};

const eps = [];
const api = require("./api/api_config.json");
resolve(api, "", eps);
console.log(eps);