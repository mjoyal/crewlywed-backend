const getAwaitAnswerData = function (gameID, db) {
  //get all players
  const query = `
    SELECT players.*, bool_and((SELECT COUNT(id) 
      FROM submissions 
      WHERE submitter_id = players.id 
      AND round_id = 1) > 0) AS answered
    FROM players
    WHERE players.session_id = $1
    GROUP BY players.id;
  ;`;
  const params = gameID;
  return db.query(query, [params])
  //loop through players
}