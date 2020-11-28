SELECT submissions.id as submission_id, text, players.username, players.avatar_id,
(SELECT json_agg(players_chose) FROM 
  (SELECT username, avatar_id FROM players
  JOIN choices ON chooser_id = players.id
  WHERE submission_id = submissions.id) 
  players_chose) as choosers,
bool_and((SELECT victim_id FROM rounds WHERE rounds.id = 1) = players.id) AS correct
FROM submissions
JOIN players ON players.id = submitter_id
WHERE round_id = 1
GROUP BY submissions.id, players.username, players.avatar_id, players.id
ORDER BY correct DESC, players.id;