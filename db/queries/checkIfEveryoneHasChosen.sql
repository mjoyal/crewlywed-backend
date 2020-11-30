SELECT bool_and(chosen) AS everyone_chosen FROM (
    SELECT players.*, bool_and((SELECT COUNT(choices.id)
      FROM choices
      JOIN submissions ON choices.submission_id = submissions.id
      WHERE chooser_id = players.id
      AND round_id = 1) > 0) AS chosen
    FROM players
    WHERE players.session_id = 1
      AND players.id NOT IN (
        SELECT victim_id
        FROM rounds
        WHERE rounds.id = 1
      )
    GROUP BY players.id
) AS chosen;
