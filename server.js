// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
app.use(morgan('dev'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const playersRoutes = require("./routes/players");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/players", playersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

//  app.use(bodyparser.json()); ???

app.get('/', (req, res) => {
  res.send("Welcome to the CrewlyWed API.");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
