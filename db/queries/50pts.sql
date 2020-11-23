-- Players get 50 points for every time they fool someone into guessing their answer, when they are not the victim.

-- This query is selecting the number of times another player chose the player in question's submission, when that player was not the victim for the given round.

SELECT count(*)
FROM choices
  JOIN submissions ON submissions.id = choices.submission_id
  JOIN rounds ON rounds.id = submissions.round_id
WHERE submissions.submitter_id = 8 -- This is a placeholder.
  AND rounds.victim_id != 8 --This is a placeholder.
