const createGame = function(createGameData, db) {
  const query = `
  INSERT INTO
  ;`;
  const params = [createGameData.gameCode, createGameData.numRounds];
  return db.query(query, params)
}

module.exports = { createGame };
