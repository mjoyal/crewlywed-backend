-- Players get 100 points for every time they correctly choose the victim's answer (when they themselves are not the victim).

-- This query is selecting the number of rounds where a player correctly chose the victim's submission.
SELECT count(*)
FROM choices
  JOIN players ON players.id = choices.chooser_id
  JOIN submissions ON submissions.id = choices.submission_id
  JOIN rounds ON submissions.round_id = rounds.id
WHERE players.id = 8 --This is a placeholder.
  AND submissions.submitter_id = rounds.victim_id
