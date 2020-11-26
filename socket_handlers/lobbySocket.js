

const { getGameCode } = require('../db/helpers/getGameCode');
const { getPlayers } = require('../db/helpers/getPlayers');


const lobbySocket = (socket, db) => {
  socket.on('createHostLobby', (gameID) => {
    getPlayers(gameID, db)
      .then(data => {
        const lobbyInfo = data.rows[0];
        lobbyInfo["gameID"] = gameID;
        socket.emit('hostLobbyReturn', lobbyInfo);
      })
      .catch(error => {
        console.error(`Cannot retreive players for gameID ${gameID}`);
      });

     getGameCode(gameID, db)
      .then(data => {
        socket.emit('gameCodeReturn', data.rows[0]);
      })
      .catch(error => {
        console.error(`Cannot retreive game code for gameID ${gameID}`)
      })
  })
};


module.exports = { lobbySocket };
