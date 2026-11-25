const path = require("node:path");
const fs = require("node:fs");
const backend = path.join(__dirname, "Backend");
process.chdir(backend);
process.env.ND_LOCAL_MODE = "sqlite";
require("./Backend/node_modules/dotenv").config();
const express = require("./Backend/node_modules/express");
const api = require("./Backend/app");
const site = express();
site.use("/Images", express.static(path.join(__dirname, "Images")));
for (const file of fs.readdirSync(__dirname).filter(name => /\.(html|css|js)$/i.test(name) && name !== "start-local.js")) {
  site.get("/" + file, (_, res) => res.sendFile(path.join(__dirname, file)));
}
site.get("/", (_, res) => res.sendFile(path.join(__dirname, "index.html")));
site.use(api);
const port = Number(process.env.ND_LOCAL_PORT || 5180);
site.listen(port, "127.0.0.1", () => console.log("NyayaDheesh running at http://127.0.0.1:" + port));
