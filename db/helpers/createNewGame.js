const createNewGame = function(createNewGameData, db) {
  const query = `
  INSERT INTO sessions (created_at, code, rounds_per_player)
  VALUES (NOW(), $1, $2)
  RETURNING id
  ;`; //NOTE: Add a "RETURNING" here later to return the id
  const params = [createNewGameData.gameCode, createNewGameData.numRounds];
  return db.query(query, params)
}

module.exports = { createNewGame };
