const { getSubmissions, getRevealData, getScoreData} = require('../db/helpers/manageRounds');

const manageRoundsSocket_roundTransitions = (socket, db, io) => {
  socket.on('startGame', (hostInfo) => {
    const gameRoom = hostInfo.code;

    socket.on('newRound', roundID => {
      // ST #1: Show ANSWER until ST expires, then show CHOOSE:
      setTimeout(() => {
        const submissionInfo = {
          round: roundID,
          session: hostInfo.session_id
        };
        getSubmissions(submissionInfo, db)
          .then((submissionData) => {
            io.in(gameRoom).emit('choosePage', submissionData.rows);
          })
        }, 10000);
      });

    socket.on('newRevealPage', () => {
       // ST #2: Show CHOOSE until ST expires. then show REVEAL:
       setTimeout(() => {
        getRevealData(roundID, db)
        .then((data) => {
          io.in(gameRoom).emit('revealPage', data.rows);
        });
      }, 10000);
    });

    socket.on('newRoundScorePage', () => {
       // ST #3: Show REVEAL until ST expires, then show ROUNDSCORE:
       setTimeout(() => {
        getScoreData(hostInfo.session_id, db)
        .then(data => {
          io.in(gameRoom).emit('roundScore', data.rows);
        });
      }, 8000)
    });

    socket.on('newAnswerPage', () => {
      // ST #4: Show ROUNDSCORE until ST expires, then show ANSWER:
      setTimeout(() => {
        io.in(gameRoom).emit('roundOver');
      }, 2000);
    }); //can we also figure out finalscore here?
  })
};

module.exports = { manageRoundsSocket_roundTransitions };
