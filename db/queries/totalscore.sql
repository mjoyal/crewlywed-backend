--This query will combine 100pts.sql and 50pts.sql to provide the total score for a user.

SELECT ((
    SELECT count(*)
    FROM choices
      JOIN players ON players.id = choices.chooser_id
      JOIN submissions ON submissions.id = choices.submission_id
      JOIN rounds ON submissions.round_id = rounds.id
    WHERE players.id = 8 --Placeholder.
      AND submissions.submitter_id = rounds.victim_id
)*100) + ((
    SELECT count(*)
    FROM choices
      JOIN submissions ON submissions.id = choices.submission_id
      JOIN rounds ON rounds.id = submissions.round_id
    WHERE submissions.submitter_id = 8 --Placeholder.
      AND rounds.victim_id != 8 --Placeholder.
)*50)
AS total_score
