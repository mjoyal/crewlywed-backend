// Load .env data into process.env:
require('dotenv').config();

// Web server config:
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const server     = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});


// PG database client/connection setup:
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();


// See HTTP requests in terminal:
app.use(morgan('dev'));


//Establish socket.io connection:
io.on('connection', () => {
  console.log('user connected')

  db.query(`SELECT * FROM avatars;`)
    .then(data => {
      const avatars = data.rows;
      io.emit('avatar', avatars);
    })

});

// Basic "Hello World" route to test this server is working:
app.get('/', (req, res) => {
  res.send("Hello world");
});


// RESTful route below. NOTE: We are probably using sockets in lieu of RESTful routes. But I am keeping the below for now (which could be used as a template for routes for other resources) until that decision is final.
const avatarsRoutes = require("./routes/avatars");
app.use("/api/avatars", avatarsRoutes(db));


server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
