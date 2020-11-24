const { createGame } = require('../db/helpers/createGame');

const createGameSocket = (socket, db) => {
  socket.on('createGame', createGameData => {
    createGame(createGameData, db)
    .then()
    .catch()
  });

};

module.exports = { createGameSocket };
