const { getSubmissions, getRevealData, getScoreData} = require('../db/helpers/manageRounds');

const manageRoundsSocket_roundTransitions = (socket, db, io) => {
  socket.on('startGame', (hostInfo) => {
    const gameRoom = hostInfo.code;

    socket.on('newRound', (roundID) => {
      // ST#1: ANSWER:
      setTimeout(() => {
        const submissionInfo = {
          round: roundID,
          session: hostInfo.session_id
        };
        getSubmissions(submissionInfo, db)
          .then((submissionData) => {
            io.in(gameRoom).emit('choosePage', submissionData.rows);
          })
            // ST #2: CHOOSE:
            setTimeout(() => {
              getRevealData(roundID, db)
              .then((data) => {
                io.in(gameRoom).emit('revealPage', data.rows);
              });
              // ST #3: REVEAL:
              setTimeout(() => {
                getScoreData(hostInfo.session_id, db)
                .then(data => {
                  io.in(gameRoom).emit('roundScore', data.rows);
                });
                // ST #4: ROUNDSCORE:
                setTimeout(() => {
                  io.in(gameRoom).emit('roundOver');
                }, 2000); // ST#4: ROUNDSCORE
              }, 8000) // ST#3: REVEAL
            }, 10000); // ST#2: CHOOSE
          }, 10000); // ST#1: ANSWER
      });
    });
};

module.exports = { manageRoundsSocket_roundTransitions };
