const { updateStartedAt, updateFinishedAt, createRounds } = require('../db/helpers/manageGame');

const manageGameSocket = (socket, db, io) => {

  socket.on('startGame', (userProfile) => {
    const gameRoom = userProfile.code;
    const gameID = userProfile.session_id;

    io.in(gameRoom).emit('startGameReturn');

    // Update the session's started_at field in the sessions table:
    updateStartedAt(gameID, db)
    .then(data => {
      console.log(`Started_at updated for session ${gameID}:`, data.rows[0]);
    });

    // Create rows for the session in the rounds table:
    createRounds(gameRoom, db)
    // .then(data => {
    //   console.log(data);
    // });

    // setTimeout to transition to end of game (this is a placeholder for now; will be updated later):
    setTimeout(() => {
      io.in(gameRoom).emit('finalScore');
      updateFinishedAt(gameID, db)
      .then(data => {
        console.log(`Finished_at updated for session ${gameID}:`, data.rows[0]);
      });
    }, 3000)

  });

};

module.exports = { manageGameSocket };
