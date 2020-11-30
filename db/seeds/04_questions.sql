--Note: The E's below some of the strings are to enable "\" to be an escape character, e.g. to escape an apostrophe. (This is necessary since we can't use double-quotes in SQL.)

INSERT INTO questions (text, victim_version, rating)
VALUES
(E'What is $name\'s biggest fear?', 'What is your biggest fear?', 'PG'),
('What would $name request for their death row meal?', 'What would you request for your death row meal?', 'PG'),
(E'What is $name\'s sage advice?', 'What is your sage advice?', 'PG'),
('What does $name want to be when they grow up?', 'What do you want to be when you grow up?', 'PG'),
('If $name won $1,000,000, what would they do?', 'If you won $1,000,000, what would you do?', 'PG'),
(E'What is $name\'s guilty pleasure TV show?', 'What is your guilty pleasure TV show?', 'PG'),
('If $name were a fictional character, who would they be?', 'If you were a fictional character, who would you be?', 'PG'),
('How would $name survive the apocalypse?', 'How would you survive the apocalypse?', 'PG'),
('If $name were a potato, how would they be cooked?', 'If you were a potato, how would you be cooked?', 'PG'),
(E'Where is $name\'s favorite place?', 'Where is your favorite place?', 'PG'),
('What would $name do if they were invisible?', 'What would you do if you were invisible?', 'PG'),
(E'What is $name\'s biggest pet peeve?', 'What is your biggest pet peeve?', 'PG'),
(E'What is $name\'s favorite catchphrase?', 'What is your favorite catchphrase?', 'PG'),
('If $name had a superpower, what would it be?', 'If you had a superpower, what would it be?', 'PG'),
('How would $name impress their alien crush?', 'How would you impress your alien crush?', 'PG'),
('What would $name be a hoarder of?', 'What would you be a hoarder of?', 'PG'),
('What would $name say if they farted in an important meeting?', 'What would you say if you farted in an important meeting?', 'PG'),
(E'$name\'s favorite Halloween activity: bobbing for ______', 'Your favorite Halloween activity: bobbing for ______', 'PG'),
(E'What is $name\'s favorite quirky fact about themselves?', 'What is your favorite quirky fact about yourself?', 'PG'),
(E'What is $name\'s signature pickup line?', 'What is your signature pickup line?', 'PG'),
(E'What would $name\'s last words be?', 'What would your last words be?', 'PG'),
('What is the name of the hit movie $name would produce?', 'What is the name of the hit movie you would produce?', 'PG'),
('What award is $name most likely to win?', 'What award are you most likely to win?', 'PG'),
('$name just got hired for the traveling circus. What is their main act?', 'You just got hired for the traveling circus. What is your main act?', 'PG'),
('If $name were any drug, they would be: ______', 'If you were any drug, you would be: ______', 'R'),
('Describe what seven minutes in heaven is like with $name.', 'Describe what seven minutes in heaven is like with yourself.', 'R'),
(E'$name\'s most controversial political opinion is: ______', 'Your most controversial political opinion is: ______', 'R')
;
