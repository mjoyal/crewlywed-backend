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


const joinGame = function(joinGameData, db) {
  // const query = `

  // ;`;
  // const params = [];
  // return db.query(query, params)
};

module.exports = { checkIfGameIsLive, checkIfGameIsFull, joinGame, getAvatarsNotInUse };
