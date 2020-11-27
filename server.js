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
const session = require('cookie-session')({
  name: 'some-session-name',
  secret: 'some-session-secret' // or an array of keys as usual
});

// Socket handlers:
const {getScoreSocket} = require('./socket_handlers/getScoreSocket');
const {getAvatarSocket} = require('./socket_handlers/getAvatarSocket');
const {createNewGameSocket} = require('./socket_handlers/createNewGameSocket');
const {joinGameSocket} = require('./socket_handlers/joinGameSocket');
const {chatSocket} = require('./socket_handlers/chatSocket');
const {createLobbySocket} = require('./socket_handlers/createLobbySocket');

// PG database client/connection setup:
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

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


  //Cookie stuff:
  let cookieString = socket.request.headers.cookie;

  let req = {connection: {encrypted: false}, headers: {cookie: cookieString}}
  let res = {getHeader: () =>{}, setHeader: () => {}};

  session(req, res, () => {
    req.session.user_id = "Cashew"; //set the cookie based on saved user_id
    console.log(req.session); // Do something with req.session
  });

  //Confirm socket connection:
  console.log('user connected to the socket');
  socket.emit('connectMessage','you are connected to the socket!');

    // Socket event handlers:
    //TRIAL:
    chatSocket(socket, io, db);
    getAvatarSocket(socket, db);
    getScoreSocket(socket, db);

    //APP:
    createNewGameSocket(socket, db);
    joinGameSocket(socket, db);
    createLobbySocket(socket, db, io);
});


// Basic "Hello World" route to test this server is working:
app.get('/', (req, res) => {
  res.send("Hello world");
});

// Have the server listen for requests on the indicated PORT:
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
