const { getGameCode, getPlayers } = require('../db/helpers/createLobby');

const createLobbySocket = (socket, db, io) => {

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`Room ${roomCode} joined`);
    io.in(roomCode).emit('allPlayersData', 'HELLOOOOOO');
  });

};

module.exports = { createLobbySocket };
