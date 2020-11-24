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

// Helper functions:
const {generateRoomCode} = require('./helpers');

// Socket handlers:
const {scoreSocket} = require('./socket_handlers/scoreSocket')
const {avatarSocket} = require('./socket_handlers/avatarSocket')
const {rowCountSocket} = require('./socket_handlers/rowCountSocket')

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

// Establish socket.io connection & listen for events:
io.on('connection', socket => {
  console.log('user connected to the socket')
  socket.emit('connectMessage','you are connected to the socket!');

    // CHAT ROOMS TEST:
    socket.on("join room", (room) => {
      socket.join(room);
      console.log(`Room ${room} joined`)
    });

    socket.on('message', (messageData) => {
      console.log(`${messageData.name} sent ${messageData.message} to ${messageData.room}`)
      io.to(messageData.room).emit('message', messageData);
    });

    // DATA FLOW TESTS:
    rowCountSocket(socket, db)
    avatarSocket(socket, db);
    scoreSocket(socket, db);

});


// Basic "Hello World" route to test this server is working:
app.get('/', (req, res) => {
  res.send("Hello world");
});

// Have the server listen for requests on the indicated PORT:
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
