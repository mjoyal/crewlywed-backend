const manageGameSocket = (socket, db, io) => {

  socket.on('startGame', (gameRoom) => {
    io.in(gameRoom).emit('startGame');

 

  });

};

module.exports = { manageGameSocket };
