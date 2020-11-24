const { getScore } = require('../db/helpers/getScore')

const getScoreSocket = (socket, db) => {
  socket.on('getScore', userID => {
    getScore(userID, db)
    .then(data => {
      const scoreData = data.rows[0];
      console.log(`[Data Flow Test #3:] Score sent for ${scoreData.username}: ${scoreData.total_score}`);
      socket.emit('scoreReturn', scoreData);
    })
    .catch(error => {
      console.error(`[Data Flow Test #2:] Player ${userID} is not in the DB`);
      socket.emit('scoreReturn', {username: "This non-existent user", total_score: "unavailable"});
    });
  });
}

module.exports = { getScoreSocket };
