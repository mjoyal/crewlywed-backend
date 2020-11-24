const { createNewGame } = require('../db/helpers/createNewGame');

const createNewGameSocket = (socket, db) => {
  socket.on('createNewGame', createNewGameData => {
    createNewGame(createNewGameData, db)
    .then(data => {
      const gameData = data.rows[0].id;
      console.log(`New game #${gameData} created`);
      socket.emit('createNewGameReturn', gameData)
    })
    .catch(error => {
      console.log(error);
    });
  });

};

module.exports = { createNewGameSocket };
