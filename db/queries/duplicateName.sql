    SELECT id
    FROM players
    WHERE username = $1
      AND session_id = $2
