const express = require("express");
const cors = require("cors");
const route = require("./route/routes");
const body_parser = require("body-parser");

const app = express();

app.use(cors());
app.use(body_parser.json());
app.use("/api", route);

module.exports = app;
