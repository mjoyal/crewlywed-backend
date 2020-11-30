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
    WHERE rating = 'PG'
    ORDER BY RANDOM()
    LIMIT $1
  ;`;
  const params = num;
  return db.query(query, [params])
};

// Get most recent ID number from rounds table
const getMostRecentRoundsID = function(db) {
  const query = `
    SELECT id
    FROM rounds
    ORDER BY id DESC
    LIMIT 1
  ;`;
  return db.query(query)
};

// Create rounds rows for game:
const createRoundsRows = function(playerIDs, questionIDs, numRounds, mostRecentRoundsID, db) {
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
  // Add id keys:
  for (let i = 1; i <= roundsRows.length; i++) {
    roundsRows[i-1].id = mostRecentRoundsID + i;
  }
  return roundsRows
};

// Insert rounds rows for game:
const insertRoundsRows = function(roundsRows, db) {
  const query = `
    INSERT INTO rounds (SELECT id, victim_id, question_id FROM
    json_populate_recordset (NULL::rounds,
      $1))
    RETURNING id
  ;`;
  const params = roundsRows;
  return db.query(query, [params])
};

const getRoundStateData = function(roundID, db) {
  const query = `
  SELECT
    rounds.id AS id,
    rounds.victim_id AS victim_id,
    rounds.question_id AS question_id,
    questions.text AS question_text,
    players.username AS victim_name,
    players.avatar_id AS victim_avatar_id
  FROM
    rounds
    JOIN questions ON rounds.question_id = questions.id
    JOIN players ON rounds.victim_id = players.id
  WHERE rounds.id = $1`
  const params = roundID;
  return db.query(query, [params])
};

const getRoundsStateData = function(roundIDs, db) {
  const promises = roundIDs.map(roundIDRow => {
    return new Promise(resolve => {
    roundID = roundIDRow.id;
    getRoundStateData(roundID, db)
      .then(data => {
        resolve(data.rows[0]);
      })
    })
  })
  return Promise.all(promises)
};

module.exports = { updateStartedAt, updateFinishedAt, getPlayerIDs, getNumRoundsPerPlayer, getQuestionIDs, getMostRecentRoundsID, createRoundsRows, insertRoundsRows, getRoundsStateData };
