const manageGameSocket = (socket, db, io) => {

  socket.on('startGame', (gameRoom) => {
    io.in(gameRoom).emit('startGame');

    setTimeout(() => {
      io.in(gameRoom).emit('finalScore');
    }, 3000)

  });

};

module.exports = { manageGameSocket };
