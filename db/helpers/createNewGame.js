const checkIfNameIsPresent = function(createNewGameData) {
  if (!createNewGameData.hostName) {
    return false;
  }
  return true;
}

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

const returnPlayerData = function(hostID, db) {
  const query = `
    SELECT
      players.id AS id,
      players.session_id AS session_id,
      players.avatar_id AS avatar_id,
      players.username AS username,
      players.creator AS creator,
      sessions.code AS code
    FROM players
      JOIN sessions ON players.session_id = sessions.id
    WHERE players.id = $1
  ;`;
  const params = [hostID];
  return db.query(query, params)

};

module.exports = { checkIfNameIsPresent, createNewGame, createNewHost, returnPlayerData };
