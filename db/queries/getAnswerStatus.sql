-- SELECT *
--   FROM players 
--   LEFT JOIN (SELECT COUNT(*), players.id AS player_id
--     FROM players
--     JOIN submissions ON players.id = submitter_id
--     WHERE round_id = 1
    
--     GROUP BY player_id
--     ) AS test
--   ON players.id = player_id
--   WHERE players.session_id = 1;

SELECT players.*, bool_and((SELECT COUNT(id) 
    FROM submissions 
    WHERE submitter_id = players.id 
    AND round_id = 1) > 0) AS answered
  FROM players
  WHERE players.session_id = 1
  GROUP BY players.id;