const createNewGame = function(createNewGameData, db) {
  const query = `
  INSERT INTO sessions (created_at, code, rounds_per_player)
  VALUES (NOW(), $1, $2)
  RETURNING id
  ;`;
  const params = [createNewGameData.gameCode, createNewGameData.numRounds];
  return db.query(query, params)
};

const createNewHost = function(createNewHostData, db) {
  const query = `
  INSERT INTO players (username, creator, session_id, avatar_id)
  VALUES ($1, $2, $3, $4)
  RETURNING id
  ;`;
  const params = [createNewHostData.username, createNewHostData.creator, createNewHostData.session_id, createNewHostData.avatar_id];
  return db.query(query, params)
};

module.exports = { createNewGame, createNewHost };
