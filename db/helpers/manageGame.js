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

// Create rounds rows for game:
const createRoundsRows = function(playerIDs, questionIDs, numRounds, db) {
  const roundsRows = [];
  // Add victim_id's:
  for (let i = 0; i < numRounds; i++) {
    for (const player of playerIDs) {
      roundsRows.push({victim_id: player.id})
    }
  }
  // Add question_id's:
  for (let i = 0; i < questionIDs.length; i++) {
    roundsRows[i].question_id = questionIDs[i].id;
  }
  return roundsRows
};




  // const roundsRows = [
  //   {question_id: 1, victim_id: 1},
  //   {question_id: 2, victim_id: 2},
  //   {question_id: 3, victim_id: 3},
  //   {question_id: 4, victim_id: 1},
  //   {question_id: 5, victim_id: 2},
  //   {question_id: 6, victim_id: 3},
  // ];





// Insert rounds rows for game:
const insertRoundsRows = function(roundRows, db) {
  // const query = `
  // ;`;
  // const params;
  // return db.query(query, [params])
};

module.exports = { updateStartedAt, updateFinishedAt, getPlayerIDs, getNumRoundsPerPlayer, getQuestionIDs, createRoundsRows, insertRoundsRows };
