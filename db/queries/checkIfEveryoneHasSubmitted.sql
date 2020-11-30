SELECT bool_and(answered) AS everyone_submitted FROM (
    SELECT players.*, bool_and((SELECT COUNT(id)
      FROM submissions
      WHERE submitter_id = players.id
      AND round_id = 1) > 0) AS answered
    FROM players
    WHERE players.session_id = 1
    GROUP BY players.id
    ORDER BY players.id
) AS answered;
