const { checkIfGameHasStarted, checkIfGameIsFull, getAvatarsNotInUse, createNewPlayer, joinGame } = require('../db/helpers/joinGame');

const joinGameSocket = (socket, db) => {
  // Listen for name and game code sent from front end:
  socket.on('joinGame', joinGameData => {
    checkIfGameHasStarted(joinGameData, db)
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
            socket.emit('joinGameReturn', sessionID)
          } else {
            console.log("Error! This game is full")
            socket.emit('joinGameErrorFull', 'sorry, this game is full!')
          }
        })
        .catch(e => console.error(e.stack))
      } else {
        console.log("Error! This is not a currently-active game")
        socket.emit('joinGameErrorInvalid', 'sorry, this is an invalid game code!')
      }
    })
    .catch(e => console.error(e.stack))
  });

  // Listen for request from front end for which avatars the new player can use:
  socket.on('getAvatarsNotInUse', gameID => {
    getAvatarsNotInUse(gameID, db)
    .then(data => {
      avatars = data.rows,
      avatarsResponseData = {
        avatars,
        gameID
      }
      socket.emit('getAvatarsNotInUseReturn', avatarsResponseData);
    })
    .catch(e => console.error(e.stack))
  });

  // Listen for request from front end to create a new player:
  socket.on('createNewPlayer', createNewPlayerData => {
    createNewPlayer(createNewPlayerData, db)
    .then(data => {
      const playerID = data.rows[0].id;
      console.log(`New player #${playerID} created`);
      socket.emit('createNewPlayerReturn', '')
    })
    .catch(error => {
      console.log(error);
    });
  });

};

module.exports = { joinGameSocket };
