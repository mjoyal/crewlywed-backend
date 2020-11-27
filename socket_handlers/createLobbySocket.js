const { getPlayers } = require('../db/helpers/createLobby');

const createLobbySocket = (socket, db, io) => {

  socket.on('joinRoom', data => {
    // Join room:
    const roomCode = data.code;
    socket.join(roomCode);
    console.log(`Room ${roomCode} joined`);

    // Get current players in room:
    const roomId = data.session_id;
    getPlayers(roomId, db)
    .then(data => {
      const playersData = data.rows;
      // playerData.code = roomCode;
      io.in(roomCode).emit('playersData', playersData);
    })
  });

  socket.on('startGame', (gameRoom) => {
    io.in(gameRoom).emit('startGame');

    setTimeout(() => {
      io.in(gameRoom).emit('finalScore');
    }, 3000)

  });

};

module.exports = { createLobbySocket };
