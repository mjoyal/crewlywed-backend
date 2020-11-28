SELECT players.*, bool_and((SELECT COUNT(choices.id) 
    FROM choices 
    JOIN submissions ON choices.submission_id = submissions.id
    WHERE chooser_id = players.id 
    AND round_id = 2) > 0) AS answered
  FROM players
  WHERE players.session_id = 1
  GROUP BY players.id;