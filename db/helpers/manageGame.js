// TIMESTAMPS:
// Update the started_at field in sessions:
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

// Update the finished_at field in sessions:
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

//ROUNDS:
// Get list of player IDs in game:

// Get number of rounds for game:

// Get list of questions for game:

// Insert rounds for the game
const createRounds = function(gameID, db) {

};

module.exports = { updateStartedAt, updateFinishedAt, createRounds };
