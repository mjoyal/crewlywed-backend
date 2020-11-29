--This query will combine 100pts.sql and 50pts.sql to provide the total score for a user.

-- SELECT players.id,((
--     SELECT count(*)
--     FROM choices
--       JOIN players ON players.id = choices.chooser_id
--       JOIN submissions ON submissions.id = choices.submission_id
--       JOIN rounds ON submissions.round_id = rounds.id
--     WHERE players.id = 8 --Placeholder.
--       AND submissions.submitter_id = rounds.victim_id
--       GROUP BY players.id
-- )*100)
-- + ((
--     SELECT count(*)
--     FROM choices
--       JOIN submissions ON submissions.id = choices.submission_id
--       JOIN rounds ON rounds.id = submissions.round_id
--     WHERE submissions.submitter_id = 8 --Placeholder.
--       AND rounds.victim_id != players.id --Placeholder.
-- )*50)
-- AS total_score, username
-- FROM players
-- -- WHERE session_id = x;
-- WHERE players.id = 8; --Placeholder


-- SELECT players.id, username, count(*)
--     FROM choices
--       JOIN players ON players.id = choices.chooser_id
--       JOIN submissions ON submissions.id = choices.submission_id
--       JOIN rounds ON submissions.round_id = rounds.id
--     WHERE choices.chooser_id = players.id --Placeholder.
--       AND submissions.submitter_id = rounds.victim_id
--     GROUP BY players.id;


-- SELECT ((
--    SELECT count(*)
--     FROM choices
--       JOIN players ON players.id = choices.chooser_id
--       JOIN submissions ON submissions.id = choices.submission_id
--       JOIN rounds ON submissions.round_id = rounds.id
--     WHERE choices.chooser_id = players.id --Placeholder.
--       AND submissions.submitter_id = rounds.victim_id
--     GROUP BY players.id
-- )*100) + ((
--     SELECT count(*)
--     FROM choices
--       JOIN submissions ON submissions.id = choices.submission_id
--       JOIN rounds ON rounds.id = submissions.round_id
--     WHERE submissions.submitter_id = players.id --Placeholder.
--       AND rounds.victim_id != players.id --Placeholder.
-- )*50)
-- AS total_score, username
-- FROM players
-- WHERE session_id = 1;

-- SELECT players.id, username, avatar_id, ((SELECT 
--   * FROM submissions
--   JOIN rounds ON submitter_id = victim_id
--   JOIN choices ON submissions.id = submission_id
--   WHERE chooser_id = players.id
--   GROUP BY players.id))
-- FROM players;

SELECT players.id, username, fool_count, correct_count, SUM((COALESCE(fooled.fool_count, 0) * 50) + (COALESCE(test.correct_count, 0) * 100)) as total FROM
  players
  LEFT JOIN ((
    SELECT players.id AS player_id, CASE WHEN count(*) IS NULL THEN 0 ELSE count(*) END as correct_count
    FROM choices
       JOIN players ON players.id = choices.chooser_id
       JOIN submissions ON submissions.id = choices.submission_id
       JOIN rounds ON submissions.round_id = rounds.id
      WHERE submissions.submitter_id = rounds.victim_id
      GROUP BY players.id
)) as test on players.id = test.player_id
  LEFT JOIN ((
    SELECT submitter_id, count(*) as fool_count
    FROM submissions
       JOIN choices on submissions.id = submission_id
       JOIN rounds on round_id = rounds.id
      WHERE submissions.submitter_id != rounds.victim_id
      GROUP BY submitter_id
  )) as fooled on players.id = fooled.submitter_id
GROUP BY players.id, fool_count, correct_count
ORDER BY players.id, total;