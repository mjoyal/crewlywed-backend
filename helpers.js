const generateRoomCode = function(length) {
  let random = '';
  const options = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    random += options.charAt(Math.floor(Math.random() * options.length));
  }
  return random;
};


module.exports = {generateRoomCode};
