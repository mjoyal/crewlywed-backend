const { updateStartedAt, createRounds } = require('../db/helpers/manageGame');

const manageGameSocket = (socket, db, io) => {

  socket.on('startGame', (userProfile) => {
    const gameRoom = userProfile.code
    const gameID = userProfile.session_id
    io.in(gameRoom).emit('startGameReturn');
    // Update the session's started_at field in the sessions table:
    updateStartedAt(gameID, db)
    .then(data => {
      console.log('Started_at updated for session:', data.rows[0]);
    });
    // Create rows for the session in the rounds table:
    createRounds(gameRoom, db)
    // .then(data => {
    //   console.log(data);
    // });

    setTimeout(() => {
      io.in(gameRoom).emit('finalScore');
    }, 3000)

  });

};

module.exports = { manageGameSocket };
