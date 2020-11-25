const checkIfGameIsLive = function (joinGameData, db) {
  const query = `
    SELECT id
    FROM sessions
    WHERE code = $1
    AND finished_at IS NULL
  ;`;
  const params = [joinGameData.gameCode];
  return db.query(query, params)
};

const checkIfGameIsFull = function(sessionID, db) {
  const query = `
    SELECT count(*)
    FROM players
      JOIN sessions ON sessions.id = players.session_id
    WHERE players.session_id = $1
  ;`;
  const params = [sessionID];
  return db.query(query, params)
};

const getAvatarsNotInUse = function(sessionID, db) {
  const query = `
    SELECT avatars.id
    FROM avatars
    WHERE avatars.id NOT IN (
      SELECT players.avatar_id
        FROM players
        WHERE players.session_id = $1
    )
  ;`;
  const params = [sessionID];
  return db.query(query, params)
};

const checkIfDuplicateName = function(createNewPlayerData, db) {
  const query = `
    SELECT id
    FROM players
    WHERE username = $1
      AND session_id = $2
  ;`;
  const params = [createNewPlayerData.username, createNewPlayerData.session_id];
  return db.query(query, params)
};

const createNewPlayer = function(createNewPlayerData, db) {
  const query = `
  INSERT INTO players (username, creator, session_id, avatar_id)
  VALUES ($1, $2, $3, $4)
  RETURNING id
  ;`;
  const params = [createNewPlayerData.username, createNewPlayerData.creator, createNewPlayerData.session_id, createNewPlayerData.avatar_id];
  return db.query(query, params)
};


const joinGame = function(joinGameData, db) {
  // const query = `

  // ;`;
  // const params = [];
  // return db.query(query, params)
};

module.exports = { checkIfGameIsLive, checkIfGameIsFull, getAvatarsNotInUse, checkIfDuplicateName, createNewPlayer, joinGame };
