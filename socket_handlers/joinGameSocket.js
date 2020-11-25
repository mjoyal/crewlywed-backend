const { checkIfGameIsLive, checkIfGameIsFull, joinGame } = require('../db/helpers/joinGame');

const joinGameSocket = (socket, db) => {
  socket.on('joinGame', joinGameData => {
    checkIfGameIsLive(joinGameData, db)
    .then(data => {
      if (data.rows[0]) {
        // console.log("Session ID:", data.rows[0])
        sessionID = data.rows[0].id;
        checkIfGameIsFull(sessionID, db)
        .then(data => {
          // console.log("# of players:", data.rows[0].count)
          numPlayers = data.rows[0].count;
          if (numPlayers < 8) {
            console.log("Success! Game exists, is live, and is not full")
            socket.emit('joinGameReturn')
          } else {
            console.log("This game is full")
            socket.emit('joinGameErrorFull', 'sorry, this game is full!')
          }
        })
        .catch(e => console.error(e.stack))
      } else {
        console.log("This is not a currently-active game")
        socket.emit('joinGameErrorInvalid', 'sorry, this is an invalid game code!')
      }
    })
    .catch(e => console.error(e.stack))
  })
};

module.exports = { joinGameSocket };
