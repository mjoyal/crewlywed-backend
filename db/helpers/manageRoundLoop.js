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

module.exports = {getAwaitAnswerData, getAwaitChoiceData}
