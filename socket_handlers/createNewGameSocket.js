const { checkIfNameIsPresent, createNewGame, createNewHost, returnPlayerData } = require('../db/helpers/createNewGame');


const createNewGameSocket = (socket, db) => {
  socket.on('createNewGame', createNewGameData => {
    if (checkIfNameIsPresent(createNewGameData)) {
    console.log(createNewGameData)
    createNewGame(createNewGameData, db)
    .then(data => {
      const gameID = data.rows[0].id;
      console.log(`New game #${gameID} created`);
      socket.emit('createNewGameReturn', gameID);
    })
    .catch(error => {
      console.log(error);
    });
  } else {
    console.log("Error! Blank name")
    socket.emit('createGameErrorBlankName', 'please enter a name!')
  }
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
