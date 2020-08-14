const winston = require("winston");
const express = require("express");
const cluster = require("cluster");
const app = express();
// console.log(cluster.isMaster);
//check if clusterfork work if not we will call it

require("./startup/validation")();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
