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

// Socket handlers:
const {createNewGameSocket} = require('./socket_handlers/createNewGameSocket');
const {joinGameSocket} = require('./socket_handlers/joinGameSocket');
const {createLobbySocket} = require('./socket_handlers/createLobbySocket');
const {manageGameSocket} = require('./socket_handlers/manageGameSocket');
const {manageRoundSocket} = require('./socket_handlers/manageRoundSocket');

// PG database client/connection setup:
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');

const db = new Pool(dbParams);
db.connect(
  console.log("Successfully connected to the DB")
);

db.query('SELECT 1 + 1;')
  .then(data => console.log("What is 1+1?", data.rows));

// See HTTP requests in terminal:
app.use(morgan('dev'));

// Set up socket server:
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// Establish socket.io connection & handle incoming events:
io.on('connection', socket => {

  //Confirm socket connection:
  console.log('user connected to the socket');
  socket.emit('connectMessage','you are connected to the socket!');

    // Socket event handlers:
    createNewGameSocket(socket, db);
    joinGameSocket(socket, db);
    createLobbySocket(socket, db, io);
    manageGameSocket(socket, db, io);
    manageRoundSocket(socket, db, io);
});


// Basic "Hello World" route to test this server is working:
app.get('/', (req, res) => {
  res.send("Hello world");
});

// Have the server listen for requests on the indicated PORT:
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
