const { returnPlayerData } = require('../db/helpers/createNewGame');
const { checkIfNameIsPresent, checkIfGameHasStarted, checkIfGameIsFull, getAvatarsNotInUse, createNewPlayer } = require('../db/helpers/joinGame');

const joinGameSocket = (socket, db) => {
  // Listen for name and game code sent from front end:
  socket.on('joinGame', joinGameData => {
    if (checkIfNameIsPresent(joinGameData)) {
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
              joinGameData.gameID = sessionID;
              socket.emit('joinGameReturn', joinGameData)
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
    } else {
      console.log("Error! Blank name")
      socket.emit('joinGameErrorBlankName', 'please enter a name!')
    }
  });

  // Listen for request from front end for which avatars the new player can use:
  socket.on('getAvatarsNotInUse', joinGameData => {
    getAvatarsNotInUse(joinGameData.gameID, db)
    .then(data => {
      avatars = data.rows,
      joinGameData.avatars = avatars;
      socket.emit('getAvatarsNotInUseReturn', joinGameData);
    })
    .catch(e => console.error(e.stack))
  });

  // Listen for request from front end to create a new player:
  socket.on('createNewPlayer', createNewPlayerData => {
    createNewPlayer(createNewPlayerData, db)
    .then(data => {
      const playerID = data.rows[0].id;
      returnPlayerData(playerID, db)
      .then(data => {
        const playerData = data.rows[0];
        socket.emit('createNewPlayerReturn', playerData)
      })
      console.log(`New player #${playerID} created`);
    })
    .catch(error => {
      console.log(error);
    });
  });

};

module.exports = { joinGameSocket };
