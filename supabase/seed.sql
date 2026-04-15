-- Optional sample data (run after schema.sql)

insert into public.products (name, description, price, image, category)
values
  (
    'Chocolate celebration cake',
    'Moist layers, ganache, and fresh berries.',
    450,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    'CAKE_ANNIVERSAIRE'
  ),
  (
    'Tea pairing assortment',
    'Curated bites for Moroccan mint tea.',
    180,
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
    'DWAZ_ATAY'
  ),
  (
    'Diamond butter cookies',
    'Crisp sablé with a light vanilla finish.',
    95,
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
    'BISCUIT_DIAMANT'
  ),
  (
    'Fudge walnut brownies',
    'Dense dark chocolate with toasted walnuts.',
    55,
    'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&q=80',
    'BROWNIES'
  ),
  (
    'Chocolate chip cookies',
    'Golden edges, soft center, premium chocolate.',
    35,
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
    'COOKIES'
  );
