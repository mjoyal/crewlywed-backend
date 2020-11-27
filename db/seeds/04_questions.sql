--Note: The E's below some of the strings are to enable "\" to be an escape character, e.g. to escape an apostrophe. (This is necessary since we can't use double-quotes in SQL.)

INSERT INTO questions (text)
VALUES
(E'What is $name\'s biggest fear?'),
('What would $name request for their death row meal?'),
(E'What is $name\'s sage advice?'),
('What does $name want to be when they grow up?'),
('If $name won $1,000,000, what would they do?'),
(E'What is $name\'s guilty pleasure TV show?'),
('If $name were a fictional character, who would they be?'),
('How would $name survive the apocalypse?'),
('If $name were a potato, how would they be cooked?'),
(E'Where is $name\'s favorite place?'),
('What would $name do if they were invisible?'),
(E'What is $name\'s biggest pet peeve?'),
(E'What is $name\'s favorite catchphrase?'),
('If $name had a superpower, what would it be?'),
('How would $name impress their alien crush?'),
('What would $name be a hoarder of?'),
('What would $name say if they farted in an important meeting?'),
(E'$name\'s favorite Halloween activity: bobbing for ______'),
(E'What is $name\'s quirky fact about themselves?'),
(E'What is $name\'s signature pickup line?'),
(E'What would $name\'s last words be?'),
('What is the name of the hit movie $name would produce?'),
('What award is $name most likely to win?'),
('$name just got hired for the traveling circus. What is their main act?')
;
