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


// generate random code
const {generateRoomCode} = require('./helpers');


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


//Establish socket.io connection & listen for events:
io.on('connection', socket => {
  console.log('user connected')


  //EXAMPLE of getting data from DB and sending it as JSON object to client, upon connection:
  db.query(`SELECT * FROM submissions;`)
    .then(data => {
      const submissions = data.rows;
      socket.emit('getSubmissions', submissions);
    })


    //CHAT ROOMS TEST:
    socket.on("join room", (room) => {
      socket.join(room);
      console.log(`Room ${room} joined`)
    });

    socket.on('message', (messageData) => {
      console.log(`${messageData.name} sent ${messageData.message} to ${messageData.room}`)
      io.to(messageData.room).emit('message', messageData);
    });


    //DATA FLOW TESTS:

    //0. Test basic data flow:
    socket.on('hi', arg => {
      console.log("Hello, ", arg.name);
    });

    //1. countRows:
    socket.on('rowCount', table => {
      db.query(`SELECT COUNT(*) FROM ${table};`)
      .then(data => {
        const rowCount = data.rows[0].count;
        console.log(`[Data Flow Test #1:] # of rows in ${table} table: ${rowCount}`);
        socket.emit('rowCountReturn', `${rowCount} rows`);
      })
      .catch(error => {
        console.error(`[Data Flow Test #1:] "${table}" is not a valid table`);
        socket.emit('rowCountReturn', `"${table}" is not a valid table.`);
      });
    });

    //2. getAvatar:
    socket.on('avatar', userID => {
      db.query(`
      SELECT image_url
      FROM avatars
      JOIN players ON players.avatar_id = avatars.id
      WHERE players.id = ${userID}
      ;`)
      .then(data => {
        if (data.rows[0].image_url) {
          console.log(`[Data Flow Test #2:] Avatar sent for player ${userID}`);
          socket.emit('avatarReturn', data.rows[0].image_url);
        }
      })
      .catch(error => {
        console.error(`[Data Flow Test #2:] Player ${userID} is not in the DB`);
        socket.emit('avatarReturn', "https://image.shutterstock.com/image-illustration/question-mark-point-red-glossy-260nw-583693069.jpg");
      });
    });

    //3. getScore:
    socket.on('score', userID => {
      db.query(`SELECT ((
        SELECT count(*)
        FROM choices
          JOIN players ON players.id = choices.chooser_id
          JOIN submissions ON submissions.id = choices.submission_id
          JOIN rounds ON submissions.round_id = rounds.id
        WHERE players.id = ${userID}
          AND submissions.submitter_id = rounds.victim_id
    )*100) + ((
        SELECT count(*)
        FROM choices
          JOIN submissions ON submissions.id = choices.submission_id
          JOIN rounds ON rounds.id = submissions.round_id
        WHERE submissions.submitter_id = ${userID}
          AND rounds.victim_id != ${userID}
    )*50)
    AS total_score, username
    FROM players
    WHERE players.id = ${userID};`)
      .then(data => {
        console.log(data);
        const scoreData = data.rows[0];
        console.log(`[Data Flow Test #3:] Score sent for ${scoreData.username}: ${scoreData.total_score}`);
        socket.emit('scoreReturn', scoreData);
      })
      .catch(error => {
        console.error(`[Data Flow Test #2:] Player ${userID} is not in the DB`);
        socket.emit('scoreReturn', {username: "This non-existent user", total_score: "unavailable"});
      });
    });

});


// Basic "Hello World" route to test this server is working:
app.get('/', (req, res) => {
  res.send("Hello world");
});


// RESTful route below. NOTE: We are probably using sockets in lieu of RESTful routes. But I am keeping the below for now (which could be used as a template for routes for other resources) until that decision is final.
const avatarsRoutes = require("./routes/avatars");
const { Socket } = require('socket.io');
app.use("/api/avatars", avatarsRoutes(db));


server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
