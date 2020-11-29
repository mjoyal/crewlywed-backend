/* Output data:
      [ {id: 30, victim_id: 20, question_id: 10, question_text: "What's $name's favorite color?", avatar_id: 2},
      {id: 31, victim_id: 20, question_id: 5, question_text: "What's $name's favorite movie?", avatar_id: 2},
      {id: 32, victim_id: 20, question_id: 16, question_text: "What's $name's favorite animal?", avatar_id: 2} ]
*/

SELECT
  rounds.id AS id,
  rounds.victim_id AS victim_id,
  rounds.question_id AS question_id,
  questions.text AS question_text,
  players.username AS victim_name,
  players.avatar_id AS avatar_id
FROM
  rounds
  JOIN questions ON rounds.question_id = questions.id
  JOIN players ON rounds.victim_id = players.id
WHERE rounds.id = 10
