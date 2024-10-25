DROP TABLE IF EXISTS questions;

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    challenge_name TEXT NOT NULL,
    question TEXT NOT NULL,
    flag TEXT NOT NULL,
    category TEXT NOT NULL,
    points INTEGER NOT NULL,
    hints TEXT[] -- Using PostgreSQL array type to store multiple hints
);