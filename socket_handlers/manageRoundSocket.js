const { insertAnswer, getSubmissions, insertChoice } = require('../db/helpers/roundHandler');
const { getAwaitAnswerData,getAwaitChoiceData, getRevealData, getScoreData} = require('../db/helpers/manageRoundLoop');

const manageRoundSocket = (socket, db, io) => {

  // manage roundStates
socket.on('startGame', (hostInfo) => {
  const gameRoom = hostInfo.code;

  // during this timer, we show the 'ANSWER' page
  socket.on('newRound', (roundID) => {

    setTimeout(() => {
      // timer is up for answering, show choose page
      // get all potential choices (submissions) for round X in session_id Y

      const submissionInfo = {
        round: roundID,
        session: hostInfo.session_id
      };
      getSubmissions(submissionInfo, db)
        .then((submissionData) => {
          io.in(gameRoom).emit('choosePage', submissionData.rows);
        })
        .catch(() => {
          console.error(`can not find submissions for round ${submissionInfo.round} and session ${submissionInfo.session}`)
        });


          // once players are on the choosePage, set new timer
          // for how long they have to choose the correct answer


          setTimeout(() => {
            // show the reveal page for time to see the results
            getRevealData(roundID, db)
            .then((data) => {
              io.in(gameRoom).emit('revealPage', data.rows);

            });





            setTimeout(() => {
              // send roundOver info with new question etc
              // however this is set to finalScore for now.
              getScoreData(hostInfo.session_id, db)
              .then(data => {
                io.in(gameRoom).emit('roundScore', data.rows);

              });

              setTimeout(() => {
                io.in(gameRoom).emit('roundOver');
              }, 2000); // ROUNDSCORE

            }, 8000) // REVEAL

          }, 10000); // CHOOSE

      }, 10000); // ANSWER
  });
});

  // Receive user submission:
  socket.on('thisUserSubmitted', (userAnswerInfo) => {
    // add users submission into submissions table
    insertAnswer(userAnswerInfo, db)
      .then(data => {
        console.log(data.rows);
      })
      .then(() => {
        return getAwaitAnswerData(userAnswerInfo.userProfile.session_id, userAnswerInfo.round, db);
      })
      .then((data) => {
        console.log("awaitData", data.rows);
        io.in(userAnswerInfo.userProfile.code).emit('awaitData', data.rows);
      })
  });

  // Receive user choice:
  socket.on('thisUserChose', (userChoiceInfo) => {

    console.log(userChoiceInfo);
    insertChoice(userChoiceInfo.choice, userChoiceInfo.userProfile.id, db)
      .then(() => {
        console.log(`added choice ${userChoiceInfo.choice} for chooser ${userChoiceInfo.userProfile.id}`)
      })
      .then(() => {
        return getAwaitChoiceData(userChoiceInfo.userProfile.session_id, userChoiceInfo.round, db);
      })
      .then((data) => {
        console.log("awaitData", data.rows);
        io.in(userChoiceInfo.userProfile.code).emit('awaitData', data.rows);
      })
  });

};



module.exports = { manageRoundSocket };
