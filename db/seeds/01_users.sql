INSERT INTO roles
  (id, name)
VALUES
  (1, 'customer'),
  (2, 'owner'),
  (3, 'staff');

INSERT INTO users
  (name, email, password, phone, instagram, role_id)
VALUES
  ('Paulie Creagh', 'pcreagh0@simplemachines.org', 'password', '770-877-7891', 'pcreagh0', 2),
  ('Bari Figgess', 'bfiggess1@jiathis.com', 'password', '377-115-2072', null, 1),
  ('Salvador McCallam', 'smccallam2@wsj.com', 'password', '299-211-3776', 'smccallam2', 1),
  ('Basilio Spours', 'bspours3@prlog.org', 'password', '175-766-8542', null, 3),
  ('Humfrid Hugle', 'hhugle4@opera.com', 'password', '504-758-4944', 'hhugle4', 1),
  ('Brittani Semerad', 'bsemerad5@about.me', 'password', '491-193-7027', null, 3),
  ('Murielle Dullard', 'mdullard6@who.int', 'password', '678-704-8386', 'mdullard6', 1),
  ('Jenny Ruoff', 'jruoff7@skype.com', 'password', '224-999-7961', null, 1),
  ('Riane Chapleo', 'rchapleo8@livejournal.com', 'password', '616-882-8069', 'rchapleo8', 1),
  ('Sybyl Dight', 'sdight9@biglobe.ne.jp', 'password', '521-473-6020', 'sdight9', 1);
