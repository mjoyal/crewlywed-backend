const chatSocket = (socket, io, db) => {
  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`Room ${room} joined`)
  });

  socket.on('message', (messageData) => {
    console.log(`${messageData.name} sent ${messageData.message} to ${messageData.room}`)
    io.to(messageData.room).emit('message', messageData);
    io.in('game').emit
  });
};

module.exports = { chatSocket };
