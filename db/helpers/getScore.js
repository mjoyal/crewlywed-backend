const getScore = function(userID, db) {
  const query = `
    SELECT ((
        SELECT count(*)
        FROM choices
          JOIN players ON players.id = choices.chooser_id
          JOIN submissions ON submissions.id = choices.submission_id
          JOIN rounds ON submissions.round_id = rounds.id
        WHERE players.id = $1
          AND submissions.submitter_id = rounds.victim_id
      )*100) + ((
        SELECT count(*)
        FROM choices
          JOIN submissions ON submissions.id = choices.submission_id
          JOIN rounds ON rounds.id = submissions.round_id
        WHERE submissions.submitter_id = $1
          AND rounds.victim_id != $1
      )*50)
    AS total_score, username
    FROM players
    WHERE players.id = $1;`;
  const params = userID;
  return db.query(query, [params])
}

module.exports = { getScore };
