const getAwaitAnswerData = function (gameID, roundID, db) {

  const query = `
    SELECT players.*, bool_and((SELECT COUNT(id)
      FROM submissions
      WHERE submitter_id = players.id
      AND round_id = $1) > 0) AS answered
    FROM players
    WHERE players.session_id = $2
    GROUP BY players.id
    ORDER BY players.id
  ;`;
  const params = [roundID, gameID];
  return db.query(query, params).then( (data) => {
    // console.log(data.rows);
    return data;
  });

};

const getAwaitChoiceData = function (gameID, roundID, db) {
  const query = `
    SELECT players.*, bool_and((SELECT COUNT(choices.id)
      FROM choices
      JOIN submissions ON choices.submission_id = submissions.id
      WHERE chooser_id = players.id
      AND round_id = $1) > 0) AS answered
    FROM players
    WHERE players.session_id = $2
    GROUP BY players.id
    ORDER BY players.id;
  `;
  const params = [roundID, gameID];
  return db.query(query, params).then( (data) => {
    // console.log(data.rows);
    return data;
  });
}


const getRevealData = function(roundID, db) {
  const query = `
    SELECT submissions.id as submission_id, text AS answer, players.username AS playerName, players.avatar_id AS avatarID,
    (SELECT json_agg(players_chose) FROM
      (SELECT username, avatar_id AS avatarID FROM players
      JOIN choices ON chooser_id = players.id
      WHERE submission_id = submissions.id)
      players_chose) as choosers,
    bool_and((SELECT victim_id FROM rounds WHERE rounds.id = $1) = players.id) AS correct
    FROM submissions
    JOIN players ON players.id = submitter_id
    WHERE round_id = $1
    GROUP BY submissions.id, players.username, players.avatar_id, players.id
    ORDER BY correct DESC, players.id
  ;`;
  const params = [roundID];
  return db.query(query, params).then( (data) => {
    // console.log(data.rows);
    return data;
  });
}
module.exports = {getAwaitAnswerData, getAwaitChoiceData, getRevealData}
