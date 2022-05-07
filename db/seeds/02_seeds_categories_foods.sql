INSERT INTO categories
  (name)
VALUES
  ('Appetizers'),
  ('Soups'),
  ('Salads'),
  ('Signature Thai'),
  ('Vegan'),
  ('Drinks');

INSERT INTO foods
  (name, price, description, category_id, calories)
VALUES
  ('Steamed Chicken Dumplings', 5.20, 'Chicken wrapped in savory dough, steamed and served with peanut sauce, green onions and crush peanuts.', 1, 150),
  ('Fried Chicken Dumplings', 5.20, 'Chicken wrapped in savory dough, fried and served with sweet chili sauce. One order comes with four pieces.', 1, 150),
  ('Thai Chicken Wings', 5.40, 'Crispy lightly seasoned WHOLE chicken wings served with sweet chili dipping sauce.', 1, 190),
  ('Thai Soup', 12.58, 'A fragrant Thai chicken broth filled with noodles, vegetables, and topped with crispy fried red shallots.', 2, 180),
  ('Tom Yum Soup', 12.58, 'A sweet, sour and spicy lemongrass infused chicken broth with noodles, vegetables, and tomato.', 2, 330),
  ('Mango Salad', 7.30, 'Mango, lettuce, coriander, shallots, red pepper, and mint, served with Thai dressing', 3, 217),
  ('Pad Salad', 12.58, 'Fresh, crisp wok-tossed vegetables including carrots, peppers, and onions, served with Thai Express savoury sauces.', 3, 230),
  ('Curry', 13.98, 'Curry with battered chicken.', 4, 300),
  ('Thairacha', 13.98, 'Battered chicken tossed in a sweet and spicy sriracha-based sauce with peppers, onions, and carrots. Served on rice.', 4, 340),
  ('Thai Pineapple', 13.98, 'Battered chicken tossed in sweet-and-sour sauce with peppers, onions, carrots, tomatoes, and pineapple, served on rice.', 4, 280),
  ('Thai Mango', 13.98, 'Battered beef tossed in sweet chilli sauce with peppers, onions, carrots, and mango, served on rice.', 4, 280),
  ('Fried Rice', 12.58, 'Fried rice with egg, green onion, carrot, onion, and your choice of flavour.', 4, 320),
  ('Stir-Fry', 12.58, 'Fresh, crisp wok-tossed vegetables including carrots, peppers, and onions, served with Thai Express savoury sauces.', 4, 340),
  ('Pad Thai', 12.58, 'Thin rice noodles stir-fried with sweet-and-sour sauce, eggs, bean sprouts, green onion, tofu, and salted radish.', 4, 320),
  ('Pad See Ew', 12.58, 'Large rice noodles served with house brand soy sauce, eggs, and Chinese broccoli.', 4, 320),
  ('Vegan Stir-Fry', 12.58, 'Fresh, crisp wok-tossed vegetables including carrots, peppers, and onions, served with Thai Express savoury sauces.', 5, 280),
  ('Vegan Pad Thai', 12.58, 'Thin rice noodles stir-fried with sweet-and-sour sauce, bean sprouts, green onion, and salted radish.', 5, 280),
  ('Bottled Water', 2.55, '', 6, 0),
  ('Sparkling Water', 3.00, '', 6, 0),
  ('Soft Drink Bottle', 2.95, '', 6, 0);
