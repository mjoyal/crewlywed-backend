const checkIfNameIsPresent = function(joinGameData) {
  if (!joinGameData.playerName) {
    return false;
  }
  return true;
};

const checkIfGameHasStarted = function (joinGameData, db) {
  const query = `
    SELECT id
    FROM sessions
    WHERE code = $1
    AND started_at IS NULL
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

const createNewPlayer = function(createNewPlayerData, db) {
  const query = `
  INSERT INTO players (username, creator, session_id, avatar_id)
  VALUES ($1, $2, $3, $4)
  RETURNING id
  ;`;
  const params = [createNewPlayerData.username, createNewPlayerData.creator, createNewPlayerData.session_id, createNewPlayerData.avatar_id];
  return db.query(query, params)
};

module.exports = { checkIfNameIsPresent, checkIfGameHasStarted, checkIfGameIsFull, getAvatarsNotInUse, createNewPlayer };
