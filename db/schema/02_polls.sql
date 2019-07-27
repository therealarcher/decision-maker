-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
  id SERIAL PRIMARY KEY NOT NULL,
  --user_id INTEGER REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  voter_url TEXT NOT NULL,
  admin_url TEXT NOT NULL,
  end_date timestamp,
  created_at timestamp
  --winning_option INTEGER REFERENCES options(id)
);
