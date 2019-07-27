DROP TABLE IF EXISTS votes CASCADE;
CREATE TABLE votes (
id SERIAL PRIMARY KEY NOT NULL,
--   poll_id INTEGER references polls(id) NOT NULL,
--   option_id INTEGER references options(id) NOT NULL,
--   user_id INTEGER references users(id),
  rank INTEGER NOT NULL  
);