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
const getPlayerIDs = function(gameID, db) {
  const query = `
    SELECT id
    FROM players
    WHERE session_id = $1
  ;`;
  const params = gameID;
  return db.query(query, [params])
};

// Get number of rounds for game:
const getNumRoundsPerPlayer = function(gameID, db) {
  const query = `
    SELECT rounds_per_player
    FROM sessions
    WHERE id = $1
  ;`;
  const params = gameID;
  return db.query(query, [params])
};

// Get list of questions for game:
const getQuestionIDs = function(num, db) {
  const query = `
    SELECT id
    FROM questions
    ORDER BY RANDOM()
    LIMIT $1
  ;`;
  const params = num;
  return db.query(query, [params])
};

// Insert rounds for the game
const createRounds = function(gameID, db) {

};

module.exports = { updateStartedAt, updateFinishedAt, createRounds };
