const { getAvatar } = require('../db/helpers/getAvatar')

const avatarSocket = (socket, db) => {
  socket.on('getAvatar', userID => {
    getAvatar(userID, db)
    .then(data => {
      if (data.rows[0].image_url) {
        console.log(`[Data Flow Test #2:] Avatar sent for player ${userID}`);
        socket.emit('avatarReturn', data.rows[0].image_url);
      }
    })
    .catch(error => {
      console.error(`[Data Flow Test #2:] Player ${userID} is not in the DB`);
      socket.emit('avatarReturn', "https://image.shutterstock.com/image-illustration/question-mark-point-red-glossy-260nw-583693069.jpg");
    });
  });
}

module.exports = { avatarSocket };
