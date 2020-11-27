const createNewHost = function(userAnswerInfo, db) {
  const query = `
  INSERT INTO players (username, creator, session_id, avatar_id)
  VALUES ($1, $2, $3, $4)
  RETURNING id
  ;`;
  const params = [userAnswerInfo.id, ];
  return db.query(query, params)
};

mod
