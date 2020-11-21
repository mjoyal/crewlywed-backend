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

// Add to app???: app.use(bodyparser.json()); (In scheduler-api)

// Below are separated Routes for each Resource. All routes for each Resource are defined in the Resource's respective file. Since these files are loaded in server.js into api/:resource, routes in these files are mounted after initial pathway. For more info: https://expressjs.com/en/guide/using-middleware.html#middleware.router.
const avatarsRoutes = require("./routes/avatars");
const choicesRoutes = require("./routes/choices");
const playersRoutes = require("./routes/players");
const questionsRoutes = require("./routes/questions");
const roundsRoutes = require("./routes/rounds");
const sessionsRoutes = require("./routes/sessions");
const submissionsRoutes = require("./routes/submissions");

// Mount all resource routes
app.use("/api/avatars", avatarsRoutes(db));
app.use("/api/choices", choicesRoutes(db));
app.use("/api/players", playersRoutes(db));
app.use("/api/questions", questionsRoutes(db));
app.use("/api/rounds", roundsRoutes(db));
app.use("/api/sessions", sessionsRoutes(db));
app.use("/api/submissions", submissionsRoutes(db));

//The below is the only route defined in this file. The rest are defined directly above.
app.get('/', (req, res) => {
  res.send("Welcome to the CrewlyWed API.");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
