/**
 * Foodies - Database File
 * World Cuisine Menu — 25 categories, 100+ dishes from every corner of the world.
 */

const MENU_CATEGORIES = [
  { id: 'pizza',      name: 'Pizza',        icon: '🍕' },
  { id: 'burger',     name: 'Burger',       icon: '🍔' },
  { id: 'bbq',        name: 'BBQ',          icon: '🍗' },
  { id: 'fastfood',   name: 'Fast Food',    icon: '🍟' },
  { id: 'steak',      name: 'Steak',        icon: '🥩' },
  { id: 'pasta',      name: 'Pasta',        icon: '🍝' },
  { id: 'salad',      name: 'Salad',        icon: '🥗' },
  { id: 'chinese',    name: 'Chinese',      icon: '🍜' },
  { id: 'desi',       name: 'Desi Food',    icon: '🍛' },
  { id: 'japanese',   name: 'Japanese',     icon: '🍣' },
  { id: 'drinks',     name: 'Drinks',       icon: '🥤' },
  { id: 'coffee',     name: 'Coffee',       icon: '☕' },
  { id: 'desserts',   name: 'Desserts',     icon: '🍰' },
  { id: 'icecream',   name: 'Ice Cream',    icon: '🍦' },
  { id: 'breakfast',  name: 'Breakfast',    icon: '🥐' },
  { id: 'sandwich',   name: 'Sandwich',     icon: '🥪' },
  { id: 'mexican',    name: 'Mexican',      icon: '🌮' },
  { id: 'thai',       name: 'Thai',         icon: '🍲' },
  { id: 'indian',     name: 'Indian',       icon: '🫕' },
  { id: 'seafood',    name: 'Seafood',      icon: '🦞' },
  { id: 'soup',       name: 'Soup',         icon: '🍵' },
  { id: 'arabic',     name: 'Arabic',       icon: '🧆' },
  { id: 'turkish',    name: 'Turkish',      icon: '🫔' },
  { id: 'korean',     name: 'Korean',       icon: '🍱' },
  { id: 'healthy',    name: 'Healthy',      icon: '🥑' }
];

const DISHES = [
  // ── PIZZA ──────────────────────────────────────────────────────────────
  {
    id: 'pizza-truffle',
    name: 'Royal Truffle Burrata Pizza',
    category: 'pizza',
    price: 32, discount: 5,
    image: 'assets/pizza-truffle.webp',
    description: 'Fresh black winter truffles, creamy burrata cheese, wild mushrooms on a slow-fermented sourdough crust.',
    ingredients: ['Black Truffle','Burrata Cheese','Wild Mushrooms','Truffle Oil','Sourdough Crust','Arugula'],
    nutrition: { carbs:'38g', protein:'18g', fat:'14g' },
    calories: 420, spicyLevel: 1, servingSize: '2 Persons', cookingTime: '15 mins',
    rating: 4.9, reviewsCount: 142, bestSeller: true, featured: true, recommended: false
  },
  {
    id: 'pizza-diavola',
    name: 'Fiery Wagyu Diavola',
    category: 'pizza',
    price: 28, discount: 0,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    description: 'Artisanal spicy salami, shaved Wagyu beef strips, Calabrian chili paste, and buffalo mozzarella topped with hot honey syrup.',
    ingredients: ['Wagyu Beef','Calabrian Chili','Spicy Salami','Buffalo Mozzarella','Hot Honey'],
    nutrition: { carbs:'40g', protein:'24g', fat:'19g' },
    calories: 510, spicyLevel: 3, servingSize: '2 Persons', cookingTime: '12 mins',
    rating: 4.8, reviewsCount: 89, bestSeller: false, featured: false, recommended: true
  },
  {
    id: 'pizza-margherita',
    name: 'Classic Margherita Napoletana',
    category: 'pizza',
    price: 22, discount: 0,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    description: 'San Marzano tomato sauce, fresh mozzarella di bufala, basil leaves, and extra virgin olive oil on a thin crispy crust.',
    ingredients: ['San Marzano Tomatoes','Mozzarella di Bufala','Fresh Basil','Olive Oil'],
    nutrition: { carbs:'35g', protein:'14g', fat:'12g' },
    calories: 380, spicyLevel: 0, servingSize: '2 Persons', cookingTime: '10 mins',
    rating: 4.7, reviewsCount: 203, bestSeller: true, featured: false, recommended: true
  },

  // ── BURGER ─────────────────────────────────────────────────────────────
  {
    id: 'burger-wagyu',
    name: 'Signature Wagyu Gold Burger',
    category: 'burger',
    price: 45, discount: 10,
    image: 'assets/burger-wagyu.webp',
    description: 'A luxurious A5 Wagyu beef patty cooked to medium-rare perfection, truffle aioli, aged cheddar, and caramelized onions on a toasted brioche bun.',
    ingredients: ['A5 Wagyu Beef','Truffle Aioli','Aged Cheddar','Caramelized Onions','Brioche Bun'],
    nutrition: { carbs:'32g', protein:'42g', fat:'35g' },
    calories: 780, spicyLevel: 1, servingSize: '1 Person', cookingTime: '20 mins',
    rating: 4.9, reviewsCount: 312, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'burger-crispy-chicken',
    name: 'Crispy Southern Chicken Burger',
    category: 'burger',
    price: 18, discount: 0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    description: 'Double-fried buttermilk chicken breast, coleslaw, pickles, and smoky chipotle mayo stacked in a toasted sesame bun.',
    ingredients: ['Buttermilk Chicken','Coleslaw','Pickles','Chipotle Mayo','Sesame Bun'],
    nutrition: { carbs:'38g', protein:'36g', fat:'22g' },
    calories: 640, spicyLevel: 2, servingSize: '1 Person', cookingTime: '15 mins',
    rating: 4.8, reviewsCount: 186, bestSeller: true, featured: true, recommended: false
  },
  {
    id: 'burger-bbq-double',
    name: 'BBQ Double Smash Burger',
    category: 'burger',
    price: 24, discount: 5,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80',
    description: 'Two smashed beef patties loaded with smoky BBQ sauce, crispy bacon, American cheese, and onion rings.',
    ingredients: ['Beef Patties','BBQ Sauce','Crispy Bacon','American Cheese','Onion Rings'],
    nutrition: { carbs:'44g', protein:'48g', fat:'40g' },
    calories: 890, spicyLevel: 1, servingSize: '1 Person', cookingTime: '18 mins',
    rating: 4.9, reviewsCount: 241, bestSeller: true, featured: false, recommended: true
  },

  // ── BBQ ────────────────────────────────────────────────────────────────
  {
    id: 'bbq-ribs',
    name: 'Smoked Honey-Glazed Short Ribs',
    category: 'bbq',
    price: 38, discount: 0,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    description: 'Beef short ribs slow-smoked over hickory wood for 12 hours, glazed with organic mountain honey and wild berry BBQ sauce.',
    ingredients: ['Beef Short Ribs','Hickory Smoke','Mountain Honey','Wild Berry BBQ Sauce'],
    nutrition: { carbs:'15g', protein:'38g', fat:'28g' },
    calories: 620, spicyLevel: 2, servingSize: '1 Person', cookingTime: '25 mins',
    rating: 4.7, reviewsCount: 95, bestSeller: false, featured: true, recommended: false
  },
  {
    id: 'bbq-chicken-platter',
    name: 'Grilled BBQ Chicken Platter',
    category: 'bbq',
    price: 26, discount: 8,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80',
    description: 'Juicy grilled chicken quarters marinated in our signature spice rub, served with corn on the cob and garlic bread.',
    ingredients: ['Whole Chicken','Signature Spice Rub','Corn on Cob','Garlic Bread','Herb Butter'],
    nutrition: { carbs:'20g', protein:'44g', fat:'18g' },
    calories: 520, spicyLevel: 2, servingSize: '1-2 Persons', cookingTime: '30 mins',
    rating: 4.8, reviewsCount: 178, bestSeller: true, featured: true, recommended: true
  },

  // ── FAST FOOD ──────────────────────────────────────────────────────────
  {
    id: 'fast-lobster-roll',
    name: 'Imperial Lobster Roll & Truffle Fries',
    category: 'fastfood',
    price: 36, discount: 8,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
    description: 'Chilled Maine lobster tossed in light lemon-herb mayo, stuffed in a warm buttered bun, served with gold truffle fries.',
    ingredients: ['Maine Lobster','Lemon-Herb Mayo','Buttered Bun','Truffle Sea Salt Fries'],
    nutrition: { carbs:'45g', protein:'28g', fat:'18g' },
    calories: 550, spicyLevel: 0, servingSize: '1 Person', cookingTime: '15 mins',
    rating: 4.8, reviewsCount: 164, bestSeller: true, featured: false, recommended: true
  },
  {
    id: 'fast-loaded-fries',
    name: 'Loaded Cheese Fries Supreme',
    category: 'fastfood',
    price: 14, discount: 0,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    description: 'Crispy seasoned fries loaded with cheddar cheese sauce, crispy bacon bits, jalapeños, sour cream and spring onions.',
    ingredients: ['Seasoned Fries','Cheddar Sauce','Bacon Bits','Jalapeños','Sour Cream'],
    nutrition: { carbs:'52g', protein:'14g', fat:'26g' },
    calories: 580, spicyLevel: 2, servingSize: '1-2 Persons', cookingTime: '12 mins',
    rating: 4.7, reviewsCount: 298, bestSeller: true, featured: false, recommended: false
  },
  {
    id: 'fast-hotdog',
    name: 'Gourmet Chicago Hot Dog',
    category: 'fastfood',
    price: 12, discount: 0,
    image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=600&q=80',
    description: 'All-beef frankfurter in a poppy seed bun, topped with yellow mustard, sweet relish, onions, tomato, pickles and celery salt.',
    ingredients: ['Beef Frankfurter','Poppy Seed Bun','Yellow Mustard','Sweet Relish','Tomatoes'],
    nutrition: { carbs:'28g', protein:'18g', fat:'16g' },
    calories: 390, spicyLevel: 1, servingSize: '1 Person', cookingTime: '8 mins',
    rating: 4.6, reviewsCount: 134, bestSeller: false, featured: false, recommended: false
  },

  // ── STEAK ──────────────────────────────────────────────────────────────
  {
    id: 'steak-tbone',
    name: 'A5 Wagyu T-Bone Steak',
    category: 'steak',
    price: 110, discount: 15,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    description: 'Premium A5 Miyazaki Wagyu T-Bone steak, grilled with rosemary garlic butter, served with asparagus and wild chanterelle reduction.',
    ingredients: ['A5 Miyazaki Wagyu','Rosemary Garlic Butter','Asparagus','Chanterelle Reduction'],
    nutrition: { carbs:'5g', protein:'58g', fat:'42g' },
    calories: 920, spicyLevel: 1, servingSize: '1-2 Persons', cookingTime: '30 mins',
    rating: 5.0, reviewsCount: 418, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'steak-ribeye',
    name: 'Prime Ribeye with Herb Butter',
    category: 'steak',
    price: 72, discount: 0,
    image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=600&q=80',
    description: 'Thick-cut prime ribeye cooked to your preferred doneness, topped with compound herb butter and served with roasted potatoes.',
    ingredients: ['Prime Ribeye','Herb Compound Butter','Roasted Potatoes','Seasonal Vegetables'],
    nutrition: { carbs:'18g', protein:'52g', fat:'38g' },
    calories: 840, spicyLevel: 0, servingSize: '1 Person', cookingTime: '25 mins',
    rating: 4.9, reviewsCount: 267, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'steak-beef',
    name: 'Classic Beef Steak & Fries',
    category: 'steak',
    price: 48, discount: 0,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80',
    description: 'Perfectly seasoned sirloin steak cooked medium, served with golden crispy fries and a rich peppercorn sauce.',
    ingredients: ['Sirloin Steak','Peppercorn Sauce','Golden Fries','Garlic Butter','Fresh Herbs'],
    nutrition: { carbs:'30g', protein:'46g', fat:'28g' },
    calories: 720, spicyLevel: 1, servingSize: '1 Person', cookingTime: '22 mins',
    rating: 4.8, reviewsCount: 341, bestSeller: true, featured: true, recommended: false
  },

  // ── PASTA ──────────────────────────────────────────────────────────────
  {
    id: 'pasta-caviar',
    name: 'Tagliolini with Caviar & Lemon Cream',
    category: 'pasta',
    price: 52, discount: 0,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    description: 'Handmade fresh egg pasta in a velvety Meyer lemon cream sauce, topped with premium Ossetra Caviar and chives.',
    ingredients: ['Handmade Tagliolini','Ossetra Caviar','Meyer Lemon','Velvet Cream','Chives'],
    nutrition: { carbs:'42g', protein:'16g', fat:'18g' },
    calories: 460, spicyLevel: 0, servingSize: '1 Person', cookingTime: '15 mins',
    rating: 4.9, reviewsCount: 77, bestSeller: false, featured: false, recommended: true
  },
  {
    id: 'pasta-carbonara',
    name: 'Authentic Spaghetti Carbonara',
    category: 'pasta',
    price: 22, discount: 0,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80',
    description: 'Classic Roman pasta with guanciale, egg yolk, Pecorino Romano, and freshly cracked black pepper.',
    ingredients: ['Spaghetti','Guanciale','Egg Yolks','Pecorino Romano','Black Pepper'],
    nutrition: { carbs:'46g', protein:'22g', fat:'20g' },
    calories: 510, spicyLevel: 0, servingSize: '1 Person', cookingTime: '18 mins',
    rating: 4.8, reviewsCount: 312, bestSeller: true, featured: false, recommended: true
  },
  {
    id: 'pasta-bolognese',
    name: 'Slow-Cooked Beef Bolognese',
    category: 'pasta',
    price: 24, discount: 0,
    image: 'https://images.unsplash.com/photo-1598866594240-496cbc7c89f4?w=600&q=80',
    description: 'Tagliatelle tossed in a rich slow-cooked Bolognese ragù with minced beef, wine, vegetables, and Parmigiano.',
    ingredients: ['Tagliatelle','Minced Beef','Red Wine','Vegetables','Parmigiano Reggiano'],
    nutrition: { carbs:'48g', protein:'28g', fat:'22g' },
    calories: 540, spicyLevel: 0, servingSize: '1 Person', cookingTime: '20 mins',
    rating: 4.7, reviewsCount: 189, bestSeller: false, featured: false, recommended: false
  },

  // ── SALAD ──────────────────────────────────────────────────────────────
  {
    id: 'salad-burrata',
    name: 'Heritage Tomato & Burrata Salad',
    category: 'salad',
    price: 18, discount: 0,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    description: 'Colorful heirloom tomatoes, fresh cream-filled burrata, pine nuts, aged balsamic glaze, and extra virgin olive oil.',
    ingredients: ['Heirloom Tomatoes','Burrata','Pine Nuts','Balsamic Glaze','Olive Oil'],
    nutrition: { carbs:'12g', protein:'10g', fat:'15g' },
    calories: 280, spicyLevel: 0, servingSize: '1 Person', cookingTime: '8 mins',
    rating: 4.7, reviewsCount: 110, bestSeller: false, featured: false, recommended: false
  },
  {
    id: 'salad-caesar',
    name: 'Classic Caesar Salad',
    category: 'salad',
    price: 16, discount: 0,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
    description: 'Crisp romaine lettuce, housemade Caesar dressing, crunchy croutons, shaved Parmigiano and anchovy fillets.',
    ingredients: ['Romaine Lettuce','Caesar Dressing','Croutons','Parmigiano','Anchovies'],
    nutrition: { carbs:'14g', protein:'8g', fat:'12g' },
    calories: 240, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.6, reviewsCount: 225, bestSeller: false, featured: false, recommended: false
  },

  // ── CHINESE ────────────────────────────────────────────────────────────
  {
    id: 'chinese-peking',
    name: 'Dynasty Peking Duck (Half)',
    category: 'chinese',
    price: 42, discount: 0,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
    description: 'Crispy wood-roasted Peking duck served with handmade thin pancakes, cucumber strips, scallions, and sweet bean sauce.',
    ingredients: ['Crispy Peking Duck','Pancakes','Scallions','Cucumber','Sweet Bean Sauce'],
    nutrition: { carbs:'28g', protein:'34g', fat:'26g' },
    calories: 590, spicyLevel: 1, servingSize: '2 Persons', cookingTime: '25 mins',
    rating: 4.9, reviewsCount: 153, bestSeller: true, featured: true, recommended: false
  },
  {
    id: 'chinese-dimsum',
    name: 'Steamed Dim Sum Basket',
    category: 'chinese',
    price: 18, discount: 0,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
    description: 'Assorted steamed dumplings including har gow, siu mai, and pork buns served with ginger soy dipping sauce.',
    ingredients: ['Shrimp Har Gow','Siu Mai','Char Siu Bao','Ginger Soy Sauce'],
    nutrition: { carbs:'30g', protein:'18g', fat:'10g' },
    calories: 320, spicyLevel: 0, servingSize: '2 Persons', cookingTime: '15 mins',
    rating: 4.8, reviewsCount: 207, bestSeller: false, featured: false, recommended: true
  },

  // ── DESI FOOD ──────────────────────────────────────────────────────────
  {
    id: 'desi-mutton-karahi',
    name: 'Kashmiri Mutton Karahi Peshawari',
    category: 'desi',
    price: 29, discount: 5,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
    description: 'Tender mutton chops cooked in an iron wok with fresh tomatoes, ginger, garlic, green chilies, and freshly ground spices.',
    ingredients: ['Mutton Chops','Fresh Tomatoes','Ginger & Garlic','Green Chilies','Karahi Spice Mix'],
    nutrition: { carbs:'8g', protein:'38g', fat:'24g' },
    calories: 480, spicyLevel: 4, servingSize: '2-3 Persons', cookingTime: '35 mins',
    rating: 4.9, reviewsCount: 298, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'desi-chicken-biryani',
    name: 'Dum Chicken Biryani',
    category: 'desi',
    price: 22, discount: 0,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
    description: 'Fragrant basmati rice layered with tender chicken, whole spices, caramelized onions, saffron and fresh mint.',
    ingredients: ['Basmati Rice','Chicken','Whole Spices','Caramelized Onions','Saffron','Fresh Mint'],
    nutrition: { carbs:'58g', protein:'32g', fat:'18g' },
    calories: 560, spicyLevel: 3, servingSize: '1-2 Persons', cookingTime: '40 mins',
    rating: 4.9, reviewsCount: 445, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'desi-dal-makhani',
    name: 'Dal Makhani & Butter Naan',
    category: 'desi',
    price: 16, discount: 0,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
    description: 'Slow-cooked black lentils in rich tomato-cream gravy finished with butter and cream, served with freshly baked naan.',
    ingredients: ['Black Lentils','Tomato Gravy','Butter','Cream','Butter Naan','Fenugreek'],
    nutrition: { carbs:'50g', protein:'16g', fat:'14g' },
    calories: 420, spicyLevel: 1, servingSize: '1-2 Persons', cookingTime: '30 mins',
    rating: 4.8, reviewsCount: 189, bestSeller: false, featured: false, recommended: true
  },

  // ── JAPANESE ───────────────────────────────────────────────────────────
  {
    id: 'japanese-wagyu-roll',
    name: 'Imperial Wagyu & Caviar Roll',
    category: 'japanese',
    price: 48, discount: 0,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    description: 'Flame-seared Wagyu beef on top of crisp tempura shrimp roll, garnished with black caviar and sweet unagi glaze.',
    ingredients: ['Wagyu Beef','Tempura Shrimp','Black Caviar','Unagi Glaze','Sushi Rice'],
    nutrition: { carbs:'35g', protein:'18g', fat:'12g' },
    calories: 390, spicyLevel: 1, servingSize: '1 Person', cookingTime: '15 mins',
    rating: 4.9, reviewsCount: 135, bestSeller: true, featured: false, recommended: true
  },
  {
    id: 'japanese-salmon-sashimi',
    name: 'Fresh Salmon Sashimi Platter',
    category: 'japanese',
    price: 34, discount: 0,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80',
    description: 'Premium grade Atlantic salmon thinly sliced, served with wasabi, pickled ginger, ponzu sauce and microgreens.',
    ingredients: ['Atlantic Salmon','Wasabi','Pickled Ginger','Ponzu Sauce','Microgreens'],
    nutrition: { carbs:'4g', protein:'28g', fat:'12g' },
    calories: 240, spicyLevel: 1, servingSize: '1 Person', cookingTime: '10 mins',
    rating: 4.9, reviewsCount: 192, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'japanese-ramen',
    name: 'Tonkotsu Black Garlic Ramen',
    category: 'japanese',
    price: 26, discount: 0,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    description: 'Rich pork bone broth with black garlic oil, chashu pork belly, soft-boiled marinated egg, nori, and bamboo shoots.',
    ingredients: ['Pork Bone Broth','Black Garlic Oil','Chashu Pork','Marinated Egg','Nori','Bamboo Shoots'],
    nutrition: { carbs:'55g', protein:'30g', fat:'24g' },
    calories: 620, spicyLevel: 2, servingSize: '1 Person', cookingTime: '20 mins',
    rating: 4.8, reviewsCount: 263, bestSeller: true, featured: true, recommended: false
  },

  // ── DRINKS ─────────────────────────────────────────────────────────────
  {
    id: 'drinks-gold-mojito',
    name: '24K Gold Royal Mojito',
    category: 'drinks',
    price: 15, discount: 0,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80',
    description: 'Refreshing blend of Cuban mint, fresh lime juice, organic sugar cane syrup, carbonated mineral water, and edible gold flakes.',
    ingredients: ['Fresh Mint','Lime Juice','Organic Sugar Cane','Gold Glitter','Edible Gold'],
    nutrition: { carbs:'20g', protein:'0g', fat:'0g' },
    calories: 90, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.8, reviewsCount: 220, bestSeller: true, featured: false, recommended: false
  },
  {
    id: 'drinks-mango-lassi',
    name: 'Chilled Mango Lassi',
    category: 'drinks',
    price: 8, discount: 0,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80',
    description: 'Creamy blended yogurt drink with sweet Alphonso mango pulp, cardamom, saffron threads, and crushed pistachios on top.',
    ingredients: ['Alphonso Mango','Full-Fat Yogurt','Cardamom','Saffron','Crushed Pistachios'],
    nutrition: { carbs:'38g', protein:'6g', fat:'4g' },
    calories: 220, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.7, reviewsCount: 312, bestSeller: true, featured: false, recommended: true
  },
  {
    id: 'drinks-fresh-juice',
    name: 'Seasonal Fresh Juice Blend',
    category: 'drinks',
    price: 9, discount: 0,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80',
    description: 'Cold-pressed seasonal fruits blended fresh daily — orange, carrot, ginger, and apple with a hint of turmeric.',
    ingredients: ['Orange','Carrot','Ginger','Apple','Turmeric'],
    nutrition: { carbs:'30g', protein:'2g', fat:'0g' },
    calories: 130, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.6, reviewsCount: 148, bestSeller: false, featured: false, recommended: false
  },

  // ── COFFEE ─────────────────────────────────────────────────────────────
  {
    id: 'coffee-truffle-latte',
    name: 'Truffle Affogato Latte',
    category: 'coffee',
    price: 12, discount: 0,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    description: 'Double shot Ethiopian Geisha espresso poured over Madagascar vanilla bean gelato, drizzled with truffle chocolate sauce.',
    ingredients: ['Geisha Espresso','Madagascar Vanilla Gelato','Truffle Chocolate Sauce'],
    nutrition: { carbs:'18g', protein:'4g', fat:'8g' },
    calories: 190, spicyLevel: 0, servingSize: '1 Person', cookingTime: '7 mins',
    rating: 4.9, reviewsCount: 174, bestSeller: true, featured: false, recommended: true
  },
  {
    id: 'coffee-cold-brew',
    name: 'Signature Cold Brew Tower',
    category: 'coffee',
    price: 10, discount: 0,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
    description: '20-hour steep cold brew concentrate served over hand-chipped ice with oat milk and a hint of vanilla syrup.',
    ingredients: ['Cold Brew Concentrate','Hand-Chipped Ice','Oat Milk','Vanilla Syrup'],
    nutrition: { carbs:'14g', protein:'2g', fat:'2g' },
    calories: 80, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.8, reviewsCount: 256, bestSeller: true, featured: false, recommended: false
  },

  // ── DESSERTS ───────────────────────────────────────────────────────────
  {
    id: 'dessert-lava',
    name: 'Luxe Chocolate Lava Sphere',
    category: 'desserts',
    price: 19, discount: 0,
    image: 'assets/dessert-lava.webp',
    description: 'A delicate chocolate dome filled with dark Valrhona hot fudge and wild raspberry coulis, melted tableside with hot butterscotch syrup.',
    ingredients: ['Valrhona Chocolate','Raspberry Coulis','Butterscotch Syrup','Gold Flake'],
    nutrition: { carbs:'30g', protein:'5g', fat:'18g' },
    calories: 380, spicyLevel: 0, servingSize: '1 Person', cookingTime: '12 mins',
    rating: 4.9, reviewsCount: 265, bestSeller: true, featured: true, recommended: true
  },
  {
    id: 'dessert-tiramisu',
    name: 'Classic Italian Tiramisu',
    category: 'desserts',
    price: 14, discount: 0,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    description: 'Layers of espresso-soaked savoiardi biscuits and mascarpone cream dusted with fine Dutch cocoa powder.',
    ingredients: ['Savoiardi Biscuits','Espresso','Mascarpone Cream','Dutch Cocoa','Egg Yolks'],
    nutrition: { carbs:'34g', protein:'6g', fat:'16g' },
    calories: 360, spicyLevel: 0, servingSize: '1 Person', cookingTime: '10 mins',
    rating: 4.8, reviewsCount: 318, bestSeller: true, featured: false, recommended: true
  },
  {
    id: 'dessert-cheesecake',
    name: 'New York Blueberry Cheesecake',
    category: 'desserts',
    price: 16, discount: 0,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    description: 'Velvety New York-style cheesecake with a buttery graham cracker crust, topped with fresh blueberry compote.',
    ingredients: ['Cream Cheese','Graham Cracker','Blueberry Compote','Sour Cream','Vanilla'],
    nutrition: { carbs:'40g', protein:'7g', fat:'22g' },
    calories: 420, spicyLevel: 0, servingSize: '1 Person', cookingTime: '8 mins',
    rating: 4.7, reviewsCount: 194, bestSeller: false, featured: false, recommended: false
  },

  // ── ICE CREAM ──────────────────────────────────────────────────────────
  {
    id: 'icecream-pistachio',
    name: 'Sicilian Gold Pistachio Gelato',
    category: 'icecream',
    price: 14, discount: 0,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    description: 'Premium churned gelato made from roasted Bronte pistachios, organic milk, sea salt and candied pistachio bits.',
    ingredients: ['Bronte Pistachios','Organic Milk','Sea Salt','Candied Pistachios'],
    nutrition: { carbs:'22g', protein:'6g', fat:'10g' },
    calories: 240, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.8, reviewsCount: 94, bestSeller: false, featured: false, recommended: false
  },
  {
    id: 'icecream-sundae',
    name: 'Ultimate Hot Fudge Sundae',
    category: 'icecream',
    price: 12, discount: 0,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    description: 'Three scoops of vanilla bean ice cream smothered in hot fudge sauce, whipped cream, sprinkles and a cherry on top.',
    ingredients: ['Vanilla Bean Ice Cream','Hot Fudge Sauce','Whipped Cream','Sprinkles','Cherry'],
    nutrition: { carbs:'55g', protein:'5g', fat:'18g' },
    calories: 490, spicyLevel: 0, servingSize: '1 Person', cookingTime: '5 mins',
    rating: 4.7, reviewsCount: 168, bestSeller: false, featured: false, recommended: false
  },

  // ── BREAKFAST ──────────────────────────────────────────────────────────
  {
    id: 'breakfast-benedict',
    name: 'Royale Smoked Salmon Benedict',
    category: 'breakfast',
    price: 24, discount: 0,
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&q=80',
    description: 'Poached free-range organic eggs, cured Scottish smoked salmon, sourdough muffin, and fresh tarragon hollandaise.',
    ingredients: ['Organic Eggs','Scottish Smoked Salmon','Hollandaise Sauce','Trout Roe','Sourdough'],
    nutrition: { carbs:'24g', protein:'22g', fat:'16g' },
    calories: 450, spicyLevel: 0, servingSize: '1 Person', cookingTime: '12 mins',
    rating: 4.9, reviewsCount: 143, bestSeller: false, featured: false, recommended: true
  },
  {
    id: 'breakfast-avocado-toast',
    name: 'Smashed Avocado Toast',
    category: 'breakfast',
    price: 16, discount: 0,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&q=80',
    description: 'Thick sourdough toast topped with smashed avocado, poached eggs, cherry tomatoes, feta cheese and chilli flakes.',
    ingredients: ['Sourdough Toast','Avocado','Poached Eggs','Cherry Tomatoes','Feta Cheese','Chilli Flakes'],
    nutrition: { carbs:'32g', protein:'14g', fat:'18g' },
    calories: 380, spicyLevel: 1, servingSize: '1 Person', cookingTime: '10 mins',
    rating: 4.7, reviewsCount: 287, bestSeller: true, featured: false, recommended: true
  },

  // ── SANDWICH ───────────────────────────────────────────────────────────
  {
    id: 'sandwich-croque',
    name: 'Luxury Croque Madame',
    category: 'sandwich',
    price: 22, discount: 0,
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80',
    description: 'Artisanal cured ham, aged gruyère cheese, black truffle béchamel sauce layered in toasted brioche and topped with a quail egg.',
    ingredients: ['Cured Ham','Gruyère Cheese','Truffle Béchamel','Brioche','Quail Egg'],
    nutrition: { carbs:'26g', protein:'18g', fat:'20g' },
    calories: 410, spicyLevel: 0, servingSize: '1 Person', cookingTime: '10 mins',
    rating: 4.7, reviewsCount: 88, bestSeller: false, featured: false, recommended: false
  },
  {
    id: 'sandwich-club',
    name: 'Triple-Decker Club Sandwich',
    category: 'sandwich',
    price: 18, discount: 0,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&q=80',
    description: 'Triple-layered toasted white bread with grilled chicken, bacon, lettuce, tomato, cheddar and mayo.',
    ingredients: ['Grilled Chicken','Bacon','Lettuce','Tomato','Cheddar','Mayo'],
    nutrition: { carbs:'42g', protein:'32g', fat:'24g' },
    calories: 580, spicyLevel: 0, servingSize: '1 Person', cookingTime: '12 mins',
    rating: 4.6, reviewsCount: 156, bestSeller: false, featured: false, recommended: false
  },

  // ── MEXICAN ────────────────────────────────────────────────────────────
  { id:'mexican-tacos', name:'Street Beef Tacos', category:'mexican', price:14, discount:0, image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80', description:'Three soft corn tortillas filled with slow-cooked seasoned beef, fresh salsa, guacamole, sour cream and lime.', ingredients:['Corn Tortilla','Seasoned Beef','Guacamole','Salsa','Lime','Sour Cream'], nutrition:{carbs:'32g',protein:'24g',fat:'16g'}, calories:380, spicyLevel:2, servingSize:'1 Person', cookingTime:'15 mins', rating:4.8, reviewsCount:189, bestSeller:true, featured:true, recommended:true },
  { id:'mexican-burrito', name:'Loaded Chicken Burrito', category:'mexican', price:16, discount:0, image:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80', description:'Giant flour tortilla stuffed with grilled chicken, Mexican rice, black beans, cheddar, pico de gallo and chipotle sauce.', ingredients:['Flour Tortilla','Grilled Chicken','Mexican Rice','Black Beans','Cheddar','Chipotle'], nutrition:{carbs:'55g',protein:'32g',fat:'18g'}, calories:560, spicyLevel:2, servingSize:'1 Person', cookingTime:'18 mins', rating:4.7, reviewsCount:142, bestSeller:false, featured:false, recommended:true },
  { id:'mexican-nachos', name:'Supreme Loaded Nachos', category:'mexican', price:18, discount:8, image:'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80', description:'Crispy tortilla chips loaded with melted nacho cheese, jalapeños, seasoned beef, sour cream and fresh guacamole.', ingredients:['Tortilla Chips','Nacho Cheese','Jalapeños','Seasoned Beef','Guacamole','Sour Cream'], nutrition:{carbs:'48g',protein:'20g',fat:'28g'}, calories:620, spicyLevel:3, servingSize:'2 Persons', cookingTime:'12 mins', rating:4.8, reviewsCount:234, bestSeller:true, featured:false, recommended:false },
  { id:'mexican-quesadilla', name:'Cheese Quesadilla Supreme', category:'mexican', price:13, discount:0, image:'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', description:'Crispy golden quesadilla filled with melted blend cheese, grilled peppers, onions and served with salsa and guacamole.', ingredients:['Flour Tortilla','Blend Cheese','Bell Peppers','Onions','Salsa','Guacamole'], nutrition:{carbs:'38g',protein:'18g',fat:'22g'}, calories:480, spicyLevel:1, servingSize:'1 Person', cookingTime:'10 mins', rating:4.6, reviewsCount:98, bestSeller:false, featured:false, recommended:false },

  // ── THAI ───────────────────────────────────────────────────────────────
  { id:'thai-pad-thai', name:'Authentic Pad Thai', category:'thai', price:18, discount:0, image:'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80', description:'Stir-fried rice noodles with shrimp, tofu, bean sprouts, eggs and roasted peanuts in a tangy tamarind sauce.', ingredients:['Rice Noodles','Shrimp','Tofu','Bean Sprouts','Eggs','Tamarind Sauce','Peanuts'], nutrition:{carbs:'52g',protein:'22g',fat:'14g'}, calories:480, spicyLevel:2, servingSize:'1 Person', cookingTime:'15 mins', rating:4.8, reviewsCount:267, bestSeller:true, featured:true, recommended:true },
  { id:'thai-green-curry', name:'Thai Green Curry', category:'thai', price:22, discount:5, image:'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80', description:'Aromatic coconut green curry with tender chicken, Thai eggplant, bamboo shoots and fresh basil leaves.', ingredients:['Chicken','Coconut Milk','Green Curry Paste','Thai Eggplant','Bamboo Shoots','Thai Basil'], nutrition:{carbs:'20g',protein:'28g',fat:'22g'}, calories:440, spicyLevel:3, servingSize:'1-2 Persons', cookingTime:'20 mins', rating:4.9, reviewsCount:312, bestSeller:true, featured:true, recommended:true },
  { id:'thai-mango-salad', name:'Green Mango Salad', category:'thai', price:14, discount:0, image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', description:'Shredded green mango with roasted peanuts, dried shrimp, chili, lime juice and a sweet fish sauce dressing.', ingredients:['Green Mango','Roasted Peanuts','Dried Shrimp','Chili','Lime','Fish Sauce'], nutrition:{carbs:'24g',protein:'8g',fat:'6g'}, calories:220, spicyLevel:3, servingSize:'1 Person', cookingTime:'10 mins', rating:4.7, reviewsCount:145, bestSeller:false, featured:false, recommended:true },

  // ── INDIAN ─────────────────────────────────────────────────────────────
  { id:'indian-butter-chicken', name:'Butter Chicken Makhani', category:'indian', price:22, discount:0, image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80', description:'Tender chicken in a rich, velvety tomato-cream sauce spiced with garam masala, served with garlic naan.', ingredients:['Chicken','Tomato Cream Sauce','Garam Masala','Butter','Fenugreek','Garlic Naan'], nutrition:{carbs:'24g',protein:'34g',fat:'22g'}, calories:520, spicyLevel:2, servingSize:'1-2 Persons', cookingTime:'25 mins', rating:4.9, reviewsCount:445, bestSeller:true, featured:true, recommended:true },
  { id:'indian-paneer-tikka', name:'Paneer Tikka Masala', category:'indian', price:19, discount:0, image:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', description:'Smoky grilled cottage cheese in a spiced masala sauce with bell peppers, onions and fresh cream.', ingredients:['Paneer','Masala Sauce','Bell Peppers','Onions','Cream','Tandoori Spice'], nutrition:{carbs:'18g',protein:'22g',fat:'18g'}, calories:420, spicyLevel:2, servingSize:'1-2 Persons', cookingTime:'20 mins', rating:4.8, reviewsCount:234, bestSeller:false, featured:false, recommended:true },
  { id:'indian-samosa', name:'Crispy Veg Samosa Chaat', category:'indian', price:12, discount:0, image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', description:'Golden crispy samosas stuffed with spiced potatoes and peas, served with tamarind chutney and fresh yogurt.', ingredients:['Potato','Green Peas','Pastry','Tamarind Chutney','Yogurt','Mint'], nutrition:{carbs:'42g',protein:'8g',fat:'16g'}, calories:380, spicyLevel:2, servingSize:'1 Person', cookingTime:'15 mins', rating:4.7, reviewsCount:312, bestSeller:true, featured:false, recommended:false },
  { id:'indian-biryani', name:'Hyderabadi Dum Biryani', category:'indian', price:24, discount:0, image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', description:'Royal Hyderabadi biryani with tender mutton, saffron-infused basmati rice, caramelized onions and whole spices.', ingredients:['Basmati Rice','Mutton','Saffron','Caramelized Onions','Whole Spices','Mint'], nutrition:{carbs:'60g',protein:'36g',fat:'20g'}, calories:580, spicyLevel:3, servingSize:'1-2 Persons', cookingTime:'45 mins', rating:4.9, reviewsCount:567, bestSeller:true, featured:true, recommended:true },

  // ── SEAFOOD ────────────────────────────────────────────────────────────
  { id:'seafood-grilled-salmon', name:'Grilled Atlantic Salmon', category:'seafood', price:32, discount:0, image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', description:'Pan-seared Atlantic salmon fillet with lemon butter sauce, capers, dill and seasonal vegetables.', ingredients:['Atlantic Salmon','Lemon Butter','Capers','Dill','Asparagus','Cherry Tomatoes'], nutrition:{carbs:'8g',protein:'38g',fat:'22g'}, calories:420, spicyLevel:0, servingSize:'1 Person', cookingTime:'18 mins', rating:4.9, reviewsCount:234, bestSeller:true, featured:true, recommended:true },
  { id:'seafood-lobster-bisque', name:'Creamy Lobster Bisque', category:'seafood', price:28, discount:0, image:'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600&q=80', description:'Velvety bisque made from fresh Maine lobster, cognac, cream and a touch of cayenne, served with crusty bread.', ingredients:['Maine Lobster','Cognac','Heavy Cream','Cayenne','Leek','Tarragon'], nutrition:{carbs:'14g',protein:'18g',fat:'24g'}, calories:380, spicyLevel:1, servingSize:'1 Person', cookingTime:'20 mins', rating:4.8, reviewsCount:145, bestSeller:false, featured:true, recommended:false },
  { id:'seafood-shrimp-scampi', name:'Garlic Shrimp Scampi', category:'seafood', price:26, discount:8, image:'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80', description:'Juicy tiger shrimp sautéed in garlic butter, white wine, lemon and fresh parsley served over angel hair pasta.', ingredients:['Tiger Shrimp','Garlic Butter','White Wine','Lemon','Parsley','Angel Hair Pasta'], nutrition:{carbs:'38g',protein:'28g',fat:'18g'}, calories:460, spicyLevel:1, servingSize:'1 Person', cookingTime:'15 mins', rating:4.8, reviewsCount:189, bestSeller:true, featured:false, recommended:true },
  { id:'seafood-fish-chips', name:'Classic Fish & Chips', category:'seafood', price:18, discount:0, image:'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', description:'Golden beer-battered cod fillet with thick-cut chips, mushy peas, tartar sauce and malt vinegar.', ingredients:['Cod Fillet','Beer Batter','Thick Chips','Mushy Peas','Tartar Sauce','Malt Vinegar'], nutrition:{carbs:'55g',protein:'28g',fat:'24g'}, calories:640, spicyLevel:0, servingSize:'1 Person', cookingTime:'20 mins', rating:4.7, reviewsCount:312, bestSeller:true, featured:false, recommended:false },

  // ── SOUP ───────────────────────────────────────────────────────────────
  { id:'soup-french-onion', name:'French Onion Soup', category:'soup', price:14, discount:0, image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', description:'Classic French onion soup with caramelized onions in beef broth, topped with a crouton and melted Gruyère crust.', ingredients:['Caramelized Onions','Beef Broth','Gruyère','Crouton','Thyme','Bay Leaf'], nutrition:{carbs:'22g',protein:'12g',fat:'14g'}, calories:280, spicyLevel:0, servingSize:'1 Person', cookingTime:'15 mins', rating:4.8, reviewsCount:198, bestSeller:false, featured:false, recommended:true },
  { id:'soup-tom-yum', name:'Thai Tom Yum Soup', category:'soup', price:16, discount:0, image:'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80', description:'Spicy-sour Thai soup with tiger shrimp, lemongrass, galangal, kaffir lime and mushrooms.', ingredients:['Tiger Shrimp','Lemongrass','Galangal','Kaffir Lime','Mushrooms','Chili'], nutrition:{carbs:'12g',protein:'18g',fat:'6g'}, calories:220, spicyLevel:4, servingSize:'1 Person', cookingTime:'15 mins', rating:4.9, reviewsCount:267, bestSeller:true, featured:true, recommended:true },
  { id:'soup-chicken-noodle', name:'Hearty Chicken Noodle Soup', category:'soup', price:14, discount:0, image:'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80', description:'Classic comfort soup with tender chicken, egg noodles, carrots, celery and fresh herbs in golden broth.', ingredients:['Chicken','Egg Noodles','Carrots','Celery','Onion','Thyme','Bay Leaf'], nutrition:{carbs:'28g',protein:'22g',fat:'8g'}, calories:320, spicyLevel:0, servingSize:'1 Person', cookingTime:'20 mins', rating:4.7, reviewsCount:145, bestSeller:false, featured:false, recommended:false },
  { id:'soup-mushroom', name:'Wild Mushroom Cream Soup', category:'soup', price:15, discount:0, image:'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80', description:'Luxurious cream soup made with wild forest mushrooms, truffle oil, shallots and fresh thyme, served with sourdough.', ingredients:['Wild Mushrooms','Heavy Cream','Truffle Oil','Shallots','Thyme','Sourdough Bread'], nutrition:{carbs:'18g',protein:'6g',fat:'20g'}, calories:280, spicyLevel:0, servingSize:'1 Person', cookingTime:'15 mins', rating:4.8, reviewsCount:123, bestSeller:false, featured:false, recommended:true },

  // ── ARABIC ─────────────────────────────────────────────────────────────
  { id:'arabic-shawarma', name:'Chicken Shawarma Wrap', category:'arabic', price:14, discount:0, image:'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&q=80', description:'Rotisserie-marinated chicken wrapped in warm pita with garlic sauce, pickles, tomatoes and fresh vegetables.', ingredients:['Marinated Chicken','Pita Bread','Garlic Sauce','Pickles','Tomatoes','Onions'], nutrition:{carbs:'42g',protein:'32g',fat:'14g'}, calories:460, spicyLevel:2, servingSize:'1 Person', cookingTime:'12 mins', rating:4.8, reviewsCount:445, bestSeller:true, featured:true, recommended:true },
  { id:'arabic-falafel', name:'Crispy Falafel Plate', category:'arabic', price:12, discount:0, image:'https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=600&q=80', description:'Golden crispy falafel balls made from ground chickpeas and herbs, served with hummus, tabbouleh and pita.', ingredients:['Chickpeas','Fresh Herbs','Hummus','Tabbouleh','Pita','Tahini Sauce'], nutrition:{carbs:'38g',protein:'16g',fat:'12g'}, calories:360, spicyLevel:1, servingSize:'1-2 Persons', cookingTime:'15 mins', rating:4.7, reviewsCount:234, bestSeller:false, featured:false, recommended:true },
  { id:'arabic-hummus', name:'Premium Hummus with Lamb', category:'arabic', price:16, discount:0, image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', description:'Silky smooth hummus topped with slow-cooked spiced lamb mince, pine nuts, paprika and extra virgin olive oil.', ingredients:['Chickpeas','Tahini','Lemon','Spiced Lamb','Pine Nuts','Olive Oil','Paprika'], nutrition:{carbs:'28g',protein:'20g',fat:'18g'}, calories:380, spicyLevel:1, servingSize:'1-2 Persons', cookingTime:'20 mins', rating:4.9, reviewsCount:189, bestSeller:true, featured:false, recommended:true },
  { id:'arabic-mansaf', name:'Royal Mansaf', category:'arabic', price:34, discount:0, image:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80', description:'Jordan\'s national dish — tender slow-cooked lamb in fermented yogurt sauce served over fragrant rice with almonds.', ingredients:['Lamb','Jameed Yogurt','Basmati Rice','Almonds','Ghee','Turmeric'], nutrition:{carbs:'52g',protein:'42g',fat:'28g'}, calories:680, spicyLevel:1, servingSize:'2-3 Persons', cookingTime:'50 mins', rating:4.9, reviewsCount:145, bestSeller:false, featured:true, recommended:true },

  // ── TURKISH ────────────────────────────────────────────────────────────
  { id:'turkish-kebab', name:'Adana Lamb Kebab', category:'turkish', price:24, discount:0, image:'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&q=80', description:'Spiced minced lamb kebab grilled on charcoal, served with lavash bread, sumac onions and roasted vegetables.', ingredients:['Minced Lamb','Turkish Spices','Lavash Bread','Sumac Onions','Roasted Peppers'], nutrition:{carbs:'24g',protein:'36g',fat:'22g'}, calories:520, spicyLevel:2, servingSize:'1 Person', cookingTime:'20 mins', rating:4.9, reviewsCount:312, bestSeller:true, featured:true, recommended:true },
  { id:'turkish-pide', name:'Turkish Pide with Minced Meat', category:'turkish', price:19, discount:0, image:'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80', description:'Boat-shaped Turkish flatbread filled with spiced minced meat, onions, peppers and fresh parsley.', ingredients:['Flatbread Dough','Minced Beef','Onions','Green Peppers','Tomatoes','Parsley'], nutrition:{carbs:'48g',protein:'28g',fat:'16g'}, calories:540, spicyLevel:1, servingSize:'1-2 Persons', cookingTime:'20 mins', rating:4.8, reviewsCount:189, bestSeller:false, featured:false, recommended:true },
  { id:'turkish-baklava', name:'Pistachio Baklava', category:'turkish', price:12, discount:0, image:'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80', description:'Delicate layers of crispy phyllo dough filled with ground pistachios, drenched in rose water syrup and honey.', ingredients:['Phyllo Dough','Ground Pistachios','Rose Water Syrup','Honey','Butter'], nutrition:{carbs:'45g',protein:'6g',fat:'18g'}, calories:380, spicyLevel:0, servingSize:'1 Person', cookingTime:'5 mins', rating:4.9, reviewsCount:445, bestSeller:true, featured:true, recommended:true },

  // ── KOREAN ─────────────────────────────────────────────────────────────
  { id:'korean-bibimbap', name:'Korean Bibimbap Bowl', category:'korean', price:20, discount:0, image:'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&q=80', description:'Colorful bowl of steamed rice topped with sautéed vegetables, marinated beef, fried egg and gochujang sauce.', ingredients:['Steamed Rice','Marinated Beef','Spinach','Carrots','Mushrooms','Fried Egg','Gochujang'], nutrition:{carbs:'58g',protein:'26g',fat:'14g'}, calories:520, spicyLevel:2, servingSize:'1 Person', cookingTime:'20 mins', rating:4.8, reviewsCount:312, bestSeller:true, featured:true, recommended:true },
  { id:'korean-fried-chicken', name:'Korean Crispy Fried Chicken', category:'korean', price:22, discount:5, image:'https://images.unsplash.com/photo-1625020645396-3f5e4f5b3a8f?w=600&q=80', description:'Double-fried ultra-crispy Korean chicken glazed in sweet-spicy gochujang sauce, served with pickled radish.', ingredients:['Chicken Wings','Gochujang Glaze','Garlic','Sesame','Pickled Radish','Spring Onion'], nutrition:{carbs:'32g',protein:'34g',fat:'22g'}, calories:560, spicyLevel:3, servingSize:'1-2 Persons', cookingTime:'25 mins', rating:4.9, reviewsCount:445, bestSeller:true, featured:true, recommended:true },
  { id:'korean-bulgogi', name:'Beef Bulgogi BBQ', category:'korean', price:26, discount:0, image:'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80', description:'Thinly sliced marinated beef grilled over charcoal, served with steamed rice, kimchi and banchan side dishes.', ingredients:['Marinated Beef','Soy Sauce','Sesame Oil','Pear','Garlic','Kimchi','Steamed Rice'], nutrition:{carbs:'38g',protein:'38g',fat:'18g'}, calories:540, spicyLevel:1, servingSize:'1-2 Persons', cookingTime:'20 mins', rating:4.8, reviewsCount:234, bestSeller:false, featured:false, recommended:true },

  // ── HEALTHY ────────────────────────────────────────────────────────────
  { id:'healthy-avocado-bowl', name:'Avocado Protein Power Bowl', category:'healthy', price:18, discount:0, image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', description:'Nutrient-packed bowl with quinoa, avocado, edamame, roasted sweet potato, kale and tahini dressing.', ingredients:['Quinoa','Avocado','Edamame','Sweet Potato','Kale','Tahini Dressing'], nutrition:{carbs:'42g',protein:'18g',fat:'16g'}, calories:380, spicyLevel:0, servingSize:'1 Person', cookingTime:'15 mins', rating:4.8, reviewsCount:267, bestSeller:false, featured:false, recommended:true },
  { id:'healthy-smoothie-bowl', name:'Acai Smoothie Bowl', category:'healthy', price:14, discount:0, image:'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80', description:'Thick blended acai with banana, topped with granola, fresh berries, coconut flakes, chia seeds and honey.', ingredients:['Acai Puree','Banana','Granola','Mixed Berries','Coconut Flakes','Chia Seeds','Honey'], nutrition:{carbs:'52g',protein:'8g',fat:'10g'}, calories:340, spicyLevel:0, servingSize:'1 Person', cookingTime:'8 mins', rating:4.7, reviewsCount:189, bestSeller:false, featured:false, recommended:true },
  { id:'healthy-grilled-veg', name:'Rainbow Grilled Vegetables', category:'healthy', price:15, discount:0, image:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', description:'Colorful medley of grilled seasonal vegetables with olive oil, herbs and balsamic glaze served with hummus.', ingredients:['Bell Peppers','Zucchini','Eggplant','Cherry Tomatoes','Olive Oil','Balsamic Glaze','Hummus'], nutrition:{carbs:'24g',protein:'8g',fat:'12g'}, calories:220, spicyLevel:0, servingSize:'1 Person', cookingTime:'15 mins', rating:4.6, reviewsCount:134, bestSeller:false, featured:false, recommended:false },
  { id:'healthy-salmon-bowl', name:'Teriyaki Salmon Poke Bowl', category:'healthy', price:24, discount:0, image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', description:'Fresh sushi-grade salmon over brown rice with edamame, cucumber, avocado, seaweed and teriyaki drizzle.', ingredients:['Sushi Salmon','Brown Rice','Edamame','Cucumber','Avocado','Seaweed','Teriyaki'], nutrition:{carbs:'44g',protein:'32g',fat:'14g'}, calories:420, spicyLevel:1, servingSize:'1 Person', cookingTime:'12 mins', rating:4.9, reviewsCount:312, bestSeller:true, featured:true, recommended:true }
];

const CHEFS = [
  {
    id: 'chef1',
    name: 'Chef James Martinez',
    role: 'Executive Chef & Culinary Director',
    experience: '22+ Years',
    awards: '3 Michelin Stars, Global Culinary Legend',
    specialDishes: 'A5 Wagyu T-Bone, Signature Wagyu Gold Burger',
    biography: 'James trained at the finest culinary academies in Paris and Tokyo. He blends luxury ingredients with modern plating to create unforgettable dining experiences.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80'
  },
  {
    id: 'chef2',
    name: 'Chef Sakura Tanaka',
    role: 'Head of Japanese & Asian Cuisine',
    experience: '18 Years',
    awards: 'Tokyo Culinary Master, Outstanding Sushi Artist',
    specialDishes: 'Imperial Wagyu Caviar Roll, Tonkotsu Ramen',
    biography: 'Sakura mastered edomae sushi techniques in Ginza. She sources the finest sustainable seafood and presents visual masterpieces that honour Japanese traditions.',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&q=80'
  },
  {
    id: 'chef3',
    name: 'Chef Isabella Moretti',
    role: 'Pastry & Dessert Specialist',
    experience: '14 Years',
    awards: 'Best European Pastry Chef 2024, Italy',
    specialDishes: 'Luxe Chocolate Lava Sphere, Classic Tiramisu',
    biography: 'Born in Sicily, Isabella creates pastry spectacles that challenge the imagination. She pairs rich textures and temperature contrasts to create the perfect sweet finish.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80'
  },
  {
    id: 'chef4',
    name: 'Chef Ali Hassan',
    role: 'Head of Desi & Middle Eastern Cuisine',
    experience: '16 Years',
    awards: 'Best Desi Chef Award 2023, Dubai Food Festival',
    specialDishes: 'Dum Chicken Biryani, Kashmiri Mutton Karahi',
    biography: 'Ali brings authentic Mughal flavors with modern technique. Trained in Lahore, Karachi and Dubai, his dum cooking method produces the most fragrant biryanis.',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80'
  }
];

const GALLERY_ITEMS = [
  { type: 'food',     src: 'assets/pizza-truffle.webp',     caption: 'Royal Truffle Pizza' },
  { type: 'food',     src: 'assets/burger-wagyu.webp',      caption: 'Wagyu Gold Burger' },
  { type: 'food',     src: 'assets/dessert-lava.webp',      caption: 'Chocolate Lava Sphere' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80', caption: 'A5 Wagyu T-Bone Steak' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', caption: 'Crispy Chicken Burger' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', caption: 'Dum Chicken Biryani' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80', caption: 'Wagyu Sushi Roll' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80', caption: 'Classic Tiramisu' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', caption: 'Smoked Honey Ribs' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80', caption: 'Salmon Sashimi' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80', caption: 'Tagliolini Pasta' },
  { type: 'food',     src: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80', caption: 'Spaghetti Carbonara' },
  { type: 'interior', src: 'assets/hero-bg.png',             caption: 'Main Dining Hall' },
  { type: 'interior', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', caption: 'VIP Lounge' },
  { type: 'interior', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', caption: 'Candlelit Tables' },
  { type: 'interior', src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80', caption: 'Outdoor Terrace' },
  { type: 'kitchen',  src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', caption: 'Chef\'s Kitchen' },
  { type: 'kitchen',  src: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&q=80', caption: 'Prep Station' }
];

const REVIEWS = [
  {
    id: 'rev1', userName: 'Alexander Wright', userTitle: 'Gourmet Critic',
    rating: 5, badge: true,
    text: 'The Wagyu Steak was absolute perfection. The marbling melted in my mouth — worth every single cent.',
    reply: 'Thank you, Alexander! We source our A5 Wagyu directly from Miyazaki Prefecture.',
    likes: 42, date: 'July 15, 2026', avatar: 'A'
  },
  {
    id: 'rev2', userName: 'Elena Rostova', userTitle: 'Elite VIP Customer',
    rating: 5, badge: true,
    text: 'The Chocolate Lava Sphere tableside melting is a work of art! Extremely premium environment and top-notch customer service.',
    reply: 'We are thrilled you enjoyed the dessert performance, Elena. We look forward to your next visit!',
    likes: 29, date: 'July 20, 2026', avatar: 'E'
  },
  {
    id: 'rev3', userName: 'Zainab Malik', userTitle: 'Food Vlogger',
    rating: 5, badge: true,
    text: 'Order the Mutton Karahi! Super tender, spice level is perfect. The biryani and the mango lassi combo is unbeatable.',
    reply: 'Thank you Zainab! Our Kashmiri Mutton Karahi uses freshly roasted ground spices prepared daily.',
    likes: 56, date: 'July 24, 2026', avatar: 'Z'
  },
  {
    id: 'rev4', userName: 'Daniel Park', userTitle: 'Regular Customer',
    rating: 5, badge: false,
    text: 'The Tonkotsu Black Garlic Ramen is the best I have had outside Japan. Rich, complex broth and the chashu pork is divine.',
    reply: 'Daniel, we are so happy Chef Sakura\'s ramen lived up to your expectations!',
    likes: 34, date: 'July 26, 2026', avatar: 'D'
  }
];

const OFFERS = [
  { id: 'off1', title: 'Happy Hour Special', tag: 'Limited Offer',   description: '15% off all Desserts and Specialty Coffee.', time: 'Everyday 4 PM - 7 PM', code: 'HAPPYHOUR' },
  { id: 'off2', title: 'Weekend Feast Deal',  tag: 'Weekend Special', description: 'Free Mango Lassi with any Biryani or Karahi order.', time: 'Friday - Sunday All Day', code: 'WEEKEND15' },
  { id: 'off3', title: 'Lunch Combo Deal',    tag: 'Corporate Deal',  description: 'Wagyu Burger + Fries + Cold Brew for just $45.', time: 'Mon - Thu 12 PM - 3 PM', code: 'LUNCHDEAL' }
];

const COUPONS = [
  { code: 'FOODIES20', type: 'percentage', value: 20, description: '20% off total order' },
  { code: 'WELCOME50', type: 'percentage', value: 50, description: '50% off for first-time diners (max $30)' },
  { code: 'FLAT10',    type: 'fixed',      value: 10, description: '$10 off total order' }
];

const DELIVERY_ZONES = [
  { zip: '10001', name: 'Downtown Core',          time: '20-30 mins', charge: 5  },
  { zip: '10002', name: 'Westminster Heights',     time: '25-35 mins', charge: 8  },
  { zip: '10003', name: 'Embassy District',        time: '30-45 mins', charge: 10 },
  { zip: '10004', name: 'Royal Estates (VIP Zone)',time: '15-25 mins', charge: 12 }
];

// Export globally
window.MENU_CATEGORIES = MENU_CATEGORIES;
window.DISHES          = DISHES;
window.CHEFS           = CHEFS;
window.GALLERY_ITEMS   = GALLERY_ITEMS;
window.REVIEWS         = REVIEWS;
window.OFFERS          = OFFERS;
window.COUPONS         = COUPONS;
window.DELIVERY_ZONES  = DELIVERY_ZONES;

// ==========================================
// COMBOS & DEALS DATA
// ==========================================
const COMBOS = [
  {
    id: 'combo-family-feast',
    name: 'Family Feast Deal',
    tag: 'Family',
    tagIcon: '👨‍👩‍👧‍👦',
    badge: 'BEST VALUE',
    badgeColor: '#10b981',
    description: 'Perfect for a family of 4! Two signature burgers, two crispy chicken burgers, four large drinks and a loaded fries platter.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    items: [
      { dishId: 'burger-wagyu',         name: 'Wagyu Gold Burger',          qty: 2 },
      { dishId: 'burger-crispy-chicken', name: 'Crispy Chicken Burger',      qty: 2 },
      { dishId: 'fast-loaded-fries',    name: 'Loaded Cheese Fries',         qty: 1 },
      { dishId: 'drinks-mango-lassi',   name: 'Mango Lassi',                 qty: 4 }
    ],
    originalPrice: 134,
    comboPrice: 99,
    saves: 35,
    servings: '4 Persons',
    cookingTime: '25 mins',
    popular: true
  },
  {
    id: 'combo-couple-date',
    name: 'Couple Date Night',
    tag: 'Couple',
    tagIcon: '💑',
    badge: 'ROMANTIC',
    badgeColor: '#ec4899',
    description: 'A romantic evening for two! Premium Wagyu steak, truffle pizza, two specialty drinks and a chocolate lava dessert.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    items: [
      { dishId: 'steak-ribeye',       name: 'Prime Ribeye Steak',     qty: 1 },
      { dishId: 'pizza-truffle',      name: 'Royal Truffle Pizza',     qty: 1 },
      { dishId: 'dessert-lava',       name: 'Chocolate Lava Sphere',   qty: 1 },
      { dishId: 'drinks-gold-mojito', name: '24K Gold Royal Mojito',   qty: 2 }
    ],
    originalPrice: 138,
    comboPrice: 105,
    saves: 33,
    servings: '2 Persons',
    cookingTime: '30 mins',
    popular: true
  },
  {
    id: 'combo-lunch-special',
    name: 'Lunch Special',
    tag: 'Lunch',
    tagIcon: '☀️',
    badge: 'WEEKDAY',
    badgeColor: '#f59e0b',
    description: 'Quick and satisfying weekday lunch! A juicy burger or pasta, fresh salad and a refreshing drink.',
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&q=80',
    items: [
      { dishId: 'burger-crispy-chicken', name: 'Crispy Chicken Burger', qty: 1 },
      { dishId: 'salad-caesar',          name: 'Caesar Salad',          qty: 1 },
      { dishId: 'drinks-fresh-juice',    name: 'Fresh Juice Blend',     qty: 1 }
    ],
    originalPrice: 43,
    comboPrice: 29,
    saves: 14,
    servings: '1 Person',
    cookingTime: '15 mins',
    popular: false
  },
  {
    id: 'combo-big-daddy',
    name: 'Big Daddy Deal',
    tag: 'Mega',
    tagIcon: '👑',
    badge: 'MEGA DEAL',
    badgeColor: '#ef4444',
    description: 'Go BIG or go home! Four smash burgers, four loaded fries, four drinks and two desserts — the ultimate feast.',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80',
    items: [
      { dishId: 'burger-bbq-double',  name: 'BBQ Double Smash Burger', qty: 4 },
      { dishId: 'fast-loaded-fries',  name: 'Loaded Cheese Fries',     qty: 4 },
      { dishId: 'drinks-mango-lassi', name: 'Mango Lassi',             qty: 4 },
      { dishId: 'dessert-tiramisu',   name: 'Classic Tiramisu',        qty: 2 }
    ],
    originalPrice: 192,
    comboPrice: 139,
    saves: 53,
    servings: '4-5 Persons',
    cookingTime: '30 mins',
    popular: true
  },
  {
    id: 'combo-desi-dawat',
    name: 'Desi Dawat Special',
    tag: 'Desi',
    tagIcon: '🍛',
    badge: 'DESI SPECIAL',
    badgeColor: '#8b5cf6',
    description: 'A full desi spread! Mutton Karahi, Dum Biryani, Dal Makhani with naan and refreshing Mango Lassi for the whole family.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
    items: [
      { dishId: 'desi-mutton-karahi',   name: 'Mutton Karahi Peshawari', qty: 1 },
      { dishId: 'desi-chicken-biryani', name: 'Dum Chicken Biryani',     qty: 2 },
      { dishId: 'desi-dal-makhani',     name: 'Dal Makhani & Naan',      qty: 1 },
      { dishId: 'drinks-mango-lassi',   name: 'Mango Lassi',             qty: 3 }
    ],
    originalPrice: 111,
    comboPrice: 79,
    saves: 32,
    servings: '3-4 Persons',
    cookingTime: '40 mins',
    popular: true
  },
  {
    name: 'Party Platter',
    tag: 'Party',
    tagIcon: '🎉',
    badge: 'GROUP DEAL',
    badgeColor: '#3b82f6',
    description: 'The ultimate party spread for 6-8 people! Mix of BBQ, burgers, steaks, sides and drinks for an unforgettable gathering.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    items: [
      { dishId: 'bbq-ribs',             name: 'Honey-Glazed Short Ribs',  qty: 2 },
      { dishId: 'burger-wagyu',         name: 'Wagyu Gold Burger',         qty: 3 },
      { dishId: 'fast-loaded-fries',    name: 'Loaded Cheese Fries',       qty: 3 },
      { dishId: 'drinks-mango-lassi',   name: 'Mango Lassi',               qty: 6 },
      { dishId: 'dessert-cheesecake',   name: 'NY Blueberry Cheesecake',   qty: 2 }
    ],
    originalPrice: 294,
    comboPrice: 219,
    saves: 75,
    servings: '6-8 Persons',
    cookingTime: '40 mins',
    popular: true
  },
  {
    id: 'combo-bbq-night',
    name: 'BBQ Night Out',
    tag: 'BBQ',
    tagIcon: '🔥',
    badge: 'SMOKY HOT',
    badgeColor: '#dc2626',
    description: 'A sizzling BBQ night for two! Smoked honey ribs, grilled chicken platter, loaded fries and two refreshing mojitos.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80',
    items: [
      { dishId: 'bbq-ribs',              name: 'Honey-Glazed Short Ribs',  qty: 1 },
      { dishId: 'bbq-chicken-platter',   name: 'BBQ Chicken Platter',      qty: 1 },
      { dishId: 'fast-loaded-fries',     name: 'Loaded Cheese Fries',      qty: 1 },
      { dishId: 'drinks-gold-mojito',    name: '24K Gold Royal Mojito',    qty: 2 }
    ],
    originalPrice: 109,
    comboPrice: 79,
    saves: 30,
    servings: '2-3 Persons',
    cookingTime: '35 mins',
    popular: true
  },
  {
    id: 'combo-student-deal',
    name: 'Student Deal',
    tag: 'Budget',
    tagIcon: '🎓',
    badge: 'BUDGET PICK',
    badgeColor: '#059669',
    description: 'Maximum taste, minimum budget! A hearty burger, classic fries and a drink — everything a student needs.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    items: [
      { dishId: 'burger-crispy-chicken', name: 'Crispy Chicken Burger',  qty: 1 },
      { dishId: 'fast-hotdog',           name: 'Gourmet Chicago Hot Dog', qty: 1 },
      { dishId: 'drinks-fresh-juice',    name: 'Fresh Juice Blend',       qty: 1 }
    ],
    originalPrice: 39,
    comboPrice: 25,
    saves: 14,
    servings: '1-2 Persons',
    cookingTime: '12 mins',
    popular: false
  }
];

window.COMBOS = COMBOS;
