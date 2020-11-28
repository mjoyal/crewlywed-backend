const { insertAnswer, getSubmissions, addChoice } = require('../db/helpers/roundHandler');
const { getAwaitAnswerData,getAwaitChoiceData} = require('../db/helpers/manageRoundLoop');

const manageRoundSocket = (socket, db, io) => {

  // manage roundStates
socket.on('startGame', (hostInfo) => {
  const gameRoom = hostInfo.code;
  const round = 1; // hardcoded round 1 for now
  // HOST INFO DATA

  /*
  { id: 33,
    session_id: 24,
    avatar_id: 6,
    username: 'hosty',
    creator: true,
    code: 'ngvus' }
    */

  // during this timer, we show the 'ANSWER' page
  setTimeout(() => {
    // timer is up for answering, show choose page
    // get all potential choices (submissions) for round X in session_id Y

    const submissionInfo = {
      round: 1,
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
          io.in(gameRoom).emit('revealPage');
          




          setTimeout(() => {
            // send roundOver info with new question etc
            // however this is set to finalScore for now.
            io.in(gameRoom).emit('roundScore');

            setTimeout(() => {
              io.in(gameRoom).emit('roundOver');
            }, 10000);

          }, 10000)

        }, 10000);

    }, 20000);

  });

  // receive user answers
  socket.on('thisUserSubmitted', (userAnswerInfo) => {
    // add users submission into submissions table
    insertAnswer(userAnswerInfo, db)
      .then(data => {
        console.log(data.rows);
      })
      .then(() => {
        return getAwaitAnswerData(userAnswerInfo.userProfile.session_id, db);
      })
      .then((data) => {
        console.log("awaitData", data.rows);
        io.in(userAnswerInfo.userProfile.code).emit('awaitAnswer', data.rows);
      })
  });

  socket.on('userChoice', (userChoiceInfo) => {

    console.log(userChoiceInfo);
    addChoice(userChoiceInfo.choice, userChoiceInfo.userProfile.id, db)
      .then(() => {
        console.log(`added choice ${userChoiceInfo.choice} for chooser ${userChoiceInfo.userProfile.id}`)
      })
  });


};



module.exports = { manageRoundSocket };
