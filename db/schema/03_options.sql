-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS options CASCADE;
CREATE TABLE options (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_id INTEGER NOT NULL REFERENCES polls(id),
  name TEXT NOT NULL
);
