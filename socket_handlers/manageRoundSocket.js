
const manageRoundSocket = (socket, db, io) => {

  // manage roundStates
socket.on('startGame', (hostInfo) => {
  const gameRoom = hostInfo.code;
  // during this timer, we show the 'ANSWER' page
  setTimeout(() => {
    // timer is up for answering, show choose page
      io.in(gameRoom).emit('choosePage');
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
            }, 5000);

          }, 5000)

        }, 5000);

    }, 5000);


  });

  // receive user answers
  socket.on('thisUserSubmitted', userAnswerInfo => {
    console.log(userAnswerInfo.answer);
  });



};



module.exports = { manageRoundSocket };
