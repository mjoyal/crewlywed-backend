const manageGameSocket = (socket, db, io) => {

  socket.on('startGame', (gameRoom) => {
    io.in(gameRoom).emit('startGameReturn');

    setTimeout(() => {
      io.in(gameRoom).emit('finalScore');
    }, 3000)

  });

};

module.exports = { manageGameSocket };
