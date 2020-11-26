const { createNewGame, createNewHost, returnPlayerData } = require('../db/helpers/createNewGame');


const createNewGameSocket = (socket, db) => {
  socket.on('createNewGame', createNewGameData => {
    createNewGame(createNewGameData, db)
    .then(data => {
      const gameID = data.rows[0].id;
      console.log(`New game #${gameID} created`);
      socket.emit('createNewGameReturn', gameID);
    })
    .catch(error => {
      console.log(error);
    });
  });

  socket.on('createNewHost', createNewHostData => {
    createNewHost(createNewHostData, db)
    .then(data => {
      const hostID = data.rows[0].id;
      returnPlayerData(hostID, db)
      .then(data => {
        const hostData = data.rows[0];
        socket.emit('createNewHostReturn', hostData);
      })
      console.log(`New host #${hostID} created`);
    })
    .catch(error => {
      console.log(error);
    });
  });

};

module.exports = { createNewGameSocket };
