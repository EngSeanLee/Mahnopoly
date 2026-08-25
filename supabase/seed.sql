-- Seeds the same placeholder listings src/lib/listings.ts currently
-- hardcodes, so the `inquiries` foreign key has something to point at.
-- Run this once after schema.sql. Delete these rows (or just let them get
-- overwritten) once real listings come in from William.

insert into listings (id, address, city, neighborhood, type, status, price, beds, baths, pets, available_date)
values
  ('clay-st', '1412 SW Clay St', 'Topeka', 'SW Topeka', 'rental', 'available', 1150, 3, 2, 'Cats only', 'Sept 1'),
  ('burlingame-rd', '3317 SW Burlingame Rd', 'Topeka', 'NW Topeka', 'rental', 'available', 1400, 4, 2, 'Dogs & cats ok', 'Sept 15'),
  ('indiana-ave', '2208 SE Indiana Ave', 'Topeka', 'College Hill', 'rental', 'rented', 875, 2, 1, 'No pets', null),
  ('lyman-rd', '905 NW Lyman Rd', 'Topeka', 'Westboro', 'sale', 'pending', 189900, 3, 2, null, null),
  ('macvicar-ave', '1725 SW MacVicar Ave', 'Topeka', 'Westboro', 'sale', 'available', 214500, 4, 3, null, null)
on conflict (id) do nothing;
