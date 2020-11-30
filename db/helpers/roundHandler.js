const insertAnswer = function(userAnswerInfo, db) {
  const query = `
  INSERT INTO submissions (submitter_id, round_id, text)
  VALUES ($1, $2, $3)
  RETURNING id
  ;`;
  const params = [userAnswerInfo.userProfile.id, userAnswerInfo.round, userAnswerInfo.answer];
  return db.query(query, params)
};

const getSubmissions = function(submissionInfo, db) {

  const query = `
  SELECT text, submissions.id, submitter_id
  FROM submissions
    JOIN players ON players.id = submissions.submitter_id
    JOIN sessions ON sessions.id = players.session_id
  WHERE round_id = $1
    AND sessions.id = $2;`;
  const params = [submissionInfo.round, submissionInfo.session];
  return db.query(query, params);
};


const insertChoice = function (choice, chooser, db) {
  const query = `
  INSERT INTO choices (submission_id, chooser_id)
  VALUES ($1, $2);`;
  const params = [choice, chooser];
  return db.query(query, params);
};

const getRevealResults = function (data, db) {
  const query = `
  ;`;
  const params = [];
  return db.query(query, params);
};


module.exports = {insertAnswer, getSubmissions, insertChoice}


