CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE CHECK (title <> '')
);

INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');