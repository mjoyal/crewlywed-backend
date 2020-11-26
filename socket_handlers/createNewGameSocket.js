const { createNewGame, createNewHost } = require('../db/helpers/createNewGame');


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
      createNewHostData.id = hostID;
      console.log(`New host #${hostID} created`);
      socket.emit('createNewHostReturn', createNewHostData);
    })
    .catch(error => {
      console.log(error);
    });
  });

};

module.exports = { createNewGameSocket };
