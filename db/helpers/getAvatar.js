const getAvatar = function(userID, db) {
  const query = `
  SELECT image_url
  FROM avatars
  JOIN players ON players.avatar_id = avatars.id
  WHERE players.id = $1;`;
  const params = userID;
  return db.query(query, [params])
}

module.exports = { getAvatar };
