const updateStartedAt = function(gameID, db) {
  const query = `
    UPDATE sessions
    SET started_at = NOW()
    WHERE sessions.id = $1
    RETURNING started_at
  ;`;
  const params = gameID;
  return db.query(query, [params])
};

const updateFinishedAt = function(gameID, db) {
  const query = `
    UPDATE sessions
    SET finished_at = NOW()
    WHERE sessions.id = $1
    RETURNING started_at
  ;`;
  const params = gameID;
  return db.query(query, [params])
};

const createRounds = function(gameID, db) {

};

module.exports = { updateStartedAt, updateFinishedAt, createRounds };
