const getGameCode = function(gameID, db) {
  const query = `
  SELECT code
  FROM sessions
  WHERE id = $1;`;
  const params = gameID;
  return db.query(query, [params])
}

module.exports = { getGameCode };
