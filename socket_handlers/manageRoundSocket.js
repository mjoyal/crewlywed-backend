const { insertAnswer, getAwaitAnswerData, checkIfEveryoneHasSubmitted, insertChoice, getAwaitChoiceData, checkIfEveryoneHasChosen, getSubmissions, getRevealData, getScoreData} = require('../db/helpers/manageRounds');

const manageRoundSocket = (socket, db, io) => {
  socket.on('startGame', (hostInfo) => {

    //VARIABLES:
    const gameRoom = hostInfo.code;
    const gameID = hostInfo.session_id;

    // let answerDone = false;
    // let chooseDone = false;

    // Timer values (in milliseconds):
    const answerDuration = 5000;
    const chooseDuration = 5000;
    const revealDuration = 3000;
    const roundscoreDuration = 3000;

    // FUNCTIONS:
    // Function for Timer #1:
    const showChoose = function(hostInfo, roundID, db) {
      const submissionInfo = {
        round: roundID,
        session: hostInfo.session_id
      };
      getSubmissions(submissionInfo, db)
      .then((submissionData) => {
        io.in(gameRoom).emit('choosePage', submissionData.rows);
      })
    };

    // Function for Timer #2:
    const showReveal = function(roundID, db) {
      getRevealData(roundID, db)
      .then((data) => {
        io.in(gameRoom).emit('revealPage', data.rows);
      })
    };

    // Function for Timer #3:
    const showRoundscore = function(gameID, db) {
      getScoreData(gameID, db)
      .then(data => {
        io.in(gameRoom).emit('roundScore', data.rows)
      });
    };

    // TRANSITION EVENT LISTENERS AND TIMERS:
    // Timer #1: Show ANSWER / AWAIT until timer expires OR until everyone submits, then show CHOOSE:
    socket.on('newRound', roundID => {
      const answerTimer = setTimeout(() => {
          showChoose(hostInfo, roundID, db);
        }, answerDuration);
      // if(answerDone) {
      //   showChoose(hostInfo, roundID, db);
      //   clearTimeout(answerTimer);
      // };
    });

    // Timer #2: Show CHOOSE / AWAIT until timer expires OR until everyone chooses. then show REVEAL:
    socket.on('newRevealPage', roundID => {
      const chooseTimer = setTimeout(() => {
        showReveal(roundID, db);
      }, chooseDuration);
      // if(chooseDone) {
      //   showReveal(roundID, db);
      //   clearTimeout(chooseTimer);
      // };
    });

    // Timer #3: Show REVEAL until timer expires, then show ROUNDSCORE:
    socket.on('newRoundScorePage', () => {
      const revealTimer = setTimeout(() => {
        showRoundscore(gameID, db);
      }, revealDuration);
    });

    // Timer #4: Show ROUNDSCORE until timer expires, then show ANSWER:
    socket.on('newAnswerPage', () => {
      const roundscoreTimer = setTimeout(() => {
        io.in(gameRoom).emit('roundOver');
      }, roundscoreDuration);
    }); //can we also figure out finalscore here? *****************


    // USER INPUT LISTENERS:
    // Receive user submission:
    socket.on('thisUserSubmitted', (userAnswerInfo) => {
      // Add user submission into submissions table
      insertAnswer(userAnswerInfo, db)
        .then(data => {
          console.log("Submissions.id:", data.rows);
        })
          .then (() => {
            return getAwaitAnswerData(userAnswerInfo.userProfile.session_id, userAnswerInfo.round, db)
          })
            .then((data) => {
              console.log("awaitData", data.rows);
              io.in(userAnswerInfo.userProfile.code).emit('awaitData', data.rows);
            })
    });
      // const roundID = userAnswerInfo.round;
      // const gameID = userAnswerInfo.userProfile.session_id;
      // // Check if everyone has submitted; if so, we will skip the the next screen:
      // checkIfEveryoneHasSubmitted(roundID, gameID, db)
      //   .then(data => {
      //     const submittedStatus = data.rows[0].submitted_status;
      //     console.log("submittedStatus:", submittedStatus);
      //   })


    // Receive user choice:
    socket.on('thisUserChose', (userChoiceInfo) => {
      // Add user choice into choices table:
      insertChoice(userChoiceInfo.choice, userChoiceInfo.userProfile.id, db)
        .then(() => {
          console.log(`added choice ${userChoiceInfo.choice} for chooser ${userChoiceInfo.userProfile.id}`)
        })
          .then(() => {
            return getAwaitChoiceData(userChoiceInfo.userProfile.session_id, userChoiceInfo.round, db)
          })
            .then((data) => {
              console.log("awaitData", data.rows);
              io.in(userChoiceInfo.userProfile.code).emit('awaitData', data.rows);
            })
    });

      // const roundID = userChoiceInfo.round;
      // const gameID = userChoiceInfo.userProfile.session_id;
      // // Check if everyone has chosen; if so, we will skip the the next screen:
      // checkIfEveryoneHasChosen(roundID, gameID, db)
      //   .then(data => {
      //     const chosenStatus = data.rows[0].chosen_status;
      //     console.log('chosenStatus:', chosenStatus);

  })
};

module.exports = { manageRoundSocket };
