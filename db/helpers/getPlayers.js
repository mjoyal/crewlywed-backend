const getPlayers = function(gameID, db) {
  const query = `
  SELECT id, username, avatar_id
  FROM players
  WHERE session_id = $1;`;
  const params = gameID;
  return db.query(query, [params])
}

module.exports = { getPlayers };
