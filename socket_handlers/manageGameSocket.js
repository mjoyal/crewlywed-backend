const { updateStartedAt } = require('../db/helpers/manageGame');

const manageGameSocket = (socket, db, io) => {

  socket.on('startGame', (gameRoom) => {
    io.in(gameRoom).emit('startGameReturn');
    // Update the session's started_at field in the sessions table:
    updateStartedAt(gameRoom)
    .then(data => {
      console.log(data);
    });
    // Create rows for the session in the rounds table:
    createRounds(gameRoom)
    .then(data => {
      console.log(data);
    });

    setTimeout(() => {
      io.in(gameRoom).emit('finalScore');
    }, 3000)

  });

};

module.exports = { manageGameSocket };
