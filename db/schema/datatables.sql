-- Drop and create data tables for CrewlyWeds
-- ERD: https://app.diagrams.net/#G1kPcrc30ZsDYApZOsROnI3mynjO8Na3uv

DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS avatars CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS choices CASCADE;

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP,
  finished_at TIMESTAMP,
  code VARCHAR(50) NOT NULL,
  num_rounds SMALLINT NOT NULL
);

CREATE TABLE avatars (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(255),
  color VARCHAR(50)
);

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  avatar_id INTEGER REFERENCES avatars(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  creator BOOLEAN DEFAULT FALSE
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL
);

CREATE TABLE rounds (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  victim_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  submitter_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  round_id INTEGER REFERENCES rounds(id) ON DELETE CASCADE,
  text VARCHAR(255)
);

CREATE TABLE choices (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  chooser_id INTEGER REFERENCES players(id) ON DELETE CASCADE
);
