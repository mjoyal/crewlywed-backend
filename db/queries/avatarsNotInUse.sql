    SELECT avatars.id
    FROM avatars
    WHERE avatars.id NOT IN (
      SELECT players.avatar_id
        FROM players
        WHERE players.session_id = 1
    )
