
const manageRoundSocket = (socket, db, io) => {

  socket.on('startGame', (gameRoom) => {
       // during this timer, we show the 'ANSWER' page
       setTimeout(() => {
        // timer is up for answering, show choose page
        io.in(gameRoom).emit('choosePage');

        // once players are on the choosePage, set new timer
        // for how long they have to choose the correct answer
        setTimeout(() => {
          // when time is up, tell client to show revealPage
          io.in(gameRoom).emit('revealPage');

          // show the reveal page for time to see the results
            setTimeout(() => {
            // send roundOver info with new question etc
            // however this is set to finalScore for now.
              io.in(gameRoom).emit('finalScore');
             }, 5000)

        }, 5000)
      }, 5000);
  });

};

module.exports = { manageRoundSocket };
