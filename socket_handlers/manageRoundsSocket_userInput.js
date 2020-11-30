const { insertAnswer, getAwaitAnswerData, checkIfEveryoneHasSubmitted, insertChoice, getAwaitChoiceData, checkIfEveryoneHasChosen} = require('../db/helpers/manageRounds');

const manageRoundsSocket_userInput = (socket, db, io) => {
// Receive user submission:
  socket.on('thisUserSubmitted', (userAnswerInfo) => {
    // Add user submission into submissions table
    insertAnswer(userAnswerInfo, db)
      .then(data => {
        console.log("Submissions.id:", data.rows);
      })
        .then (() => {
          const roundID = userAnswerInfo.round;
          const gameID = userAnswerInfo.userProfile.session_id;
          // Check if everyone has submitted; if so, we will skip the the next screen:
          checkIfEveryoneHasSubmitted(roundID, gameID, db)
            .then(data => {
              const submittedStatus = data.rows[0].submitted_status;
              console.log("submittedStatus:", submittedStatus);
              if (submittedStatus) {
                console.log("SUBMITTED STATUS = TRUE")
              } else {
                return getAwaitAnswerData(userAnswerInfo.userProfile.session_id, userAnswerInfo.round, db)
                  .then((data) => {
                    console.log("awaitData", data.rows);
                    io.in(userAnswerInfo.userProfile.code).emit('awaitData', data.rows);
                  })
                }
              })
            })
    });

  // Receive user choice:
  socket.on('thisUserChose', (userChoiceInfo) => {
    // Add user choice into choices table:
    insertChoice(userChoiceInfo.choice, userChoiceInfo.userProfile.id, db)
      .then(() => {
        console.log(`added choice ${userChoiceInfo.choice} for chooser ${userChoiceInfo.userProfile.id}`)
      })
        .then(() => {
          const roundID = userChoiceInfo.round;
          const gameID = userChoiceInfo.userProfile.session_id;
          // Check if everyone has chosen; if so, we will skip the the next screen:
          checkIfEveryoneHasChosen(roundID, gameID, db)
            .then(data => {
              const chosenStatus = data.rows[0].chosen_status;
              console.log('chosenStatus:', chosenStatus);
              if (chosenStatus) {
                console.log("CHOSEN STATUS = TRUE")
              } else {
                return getAwaitChoiceData(userChoiceInfo.userProfile.session_id, userChoiceInfo.round, db)
                  .then((data) => {
                    console.log("awaitData", data.rows);
                    io.in(userChoiceInfo.userProfile.code).emit('awaitData', data.rows);
                  })
                }
              })
            })
    });
}

module.exports = { manageRoundsSocket_userInput };
