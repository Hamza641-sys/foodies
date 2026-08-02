/**
 * Foodies - Combo Deals Data
 * ES Module export for use in app.js
 */

export const COMBOS_DATA = [
  {
    id: 'combo-family-feast',
    name: 'Family Feast Deal',
    tag: 'Family', tagIcon: '👨‍👩‍👧‍👦',
    badge: 'BEST VALUE', badgeColor: '#10b981',
    description: 'Perfect for a family of 4! Two signature burgers, two crispy chicken burgers, four large drinks and a loaded fries platter.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    items: [
      { dishId:'burger-wagyu', name:'Wagyu Gold Burger', qty:2 },
      { dishId:'burger-crispy-chicken', name:'Crispy Chicken Burger', qty:2 },
      { dishId:'fast-loaded-fries', name:'Loaded Cheese Fries', qty:1 },
      { dishId:'drinks-mango-lassi', name:'Mango Lassi', qty:4 }
    ],
    originalPrice:134, comboPrice:99, saves:35,
    servings:'4 Persons', cookingTime:'25 mins', popular:true
  },
  {
    id: 'combo-couple-date',
    name: 'Couple Date Night',
    tag: 'Couple', tagIcon: '💑',
    badge: 'ROMANTIC', badgeColor: '#ec4899',
    description: 'A romantic evening for two! Premium Wagyu steak, truffle pizza, two specialty drinks and a chocolate lava dessert.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    items: [
      { dishId:'steak-ribeye', name:'Prime Ribeye Steak', qty:1 },
      { dishId:'pizza-truffle', name:'Royal Truffle Pizza', qty:1 },
      { dishId:'dessert-lava', name:'Chocolate Lava Sphere', qty:1 },
      { dishId:'drinks-gold-mojito', name:'24K Gold Royal Mojito', qty:2 }
    ],
    originalPrice:138, comboPrice:105, saves:33,
    servings:'2 Persons', cookingTime:'30 mins', popular:true
  },
  {
    id: 'combo-big-daddy',
    name: 'Big Daddy Deal',
    tag: 'Mega', tagIcon: '👑',
    badge: 'MEGA DEAL', badgeColor: '#ef4444',
    description: 'Go BIG or go home! Four smash burgers, four loaded fries, four drinks and two desserts.',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80',
    items: [
      { dishId:'burger-bbq-double', name:'BBQ Double Smash Burger', qty:4 },
      { dishId:'fast-loaded-fries', name:'Loaded Cheese Fries', qty:4 },
      { dishId:'drinks-mango-lassi', name:'Mango Lassi', qty:4 },
      { dishId:'dessert-tiramisu', name:'Classic Tiramisu', qty:2 }
    ],
    originalPrice:192, comboPrice:139, saves:53,
    servings:'4-5 Persons', cookingTime:'30 mins', popular:true
  },
  {
    id: 'combo-desi-dawat',
    name: 'Desi Dawat Special',
    tag: 'Desi', tagIcon: '🍛',
    badge: 'DESI SPECIAL', badgeColor: '#8b5cf6',
    description: 'A full desi spread! Mutton Karahi, Dum Biryani, Dal Makhani with naan and Mango Lassi.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
    items: [
      { dishId:'desi-mutton-karahi', name:'Mutton Karahi Peshawari', qty:1 },
      { dishId:'desi-chicken-biryani', name:'Dum Chicken Biryani', qty:2 },
      { dishId:'desi-dal-makhani', name:'Dal Makhani & Naan', qty:1 },
      { dishId:'drinks-mango-lassi', name:'Mango Lassi', qty:3 }
    ],
    originalPrice:111, comboPrice:79, saves:32,
    servings:'3-4 Persons', cookingTime:'40 mins', popular:true
  },
  {
    id: 'combo-party-platter',
    name: 'Party Platter',
    tag: 'Party', tagIcon: '🎉',
    badge: 'GROUP DEAL', badgeColor: '#3b82f6',
    description: 'The ultimate party spread for 6-8 people! Mix of BBQ, burgers, sides and drinks.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    items: [
      { dishId:'bbq-ribs', name:'Honey-Glazed Short Ribs', qty:2 },
      { dishId:'burger-wagyu', name:'Wagyu Gold Burger', qty:3 },
      { dishId:'fast-loaded-fries', name:'Loaded Cheese Fries', qty:3 },
      { dishId:'drinks-mango-lassi', name:'Mango Lassi', qty:6 }
    ],
    originalPrice:294, comboPrice:219, saves:75,
    servings:'6-8 Persons', cookingTime:'40 mins', popular:true
  },
  {
    id: 'combo-bbq-night',
    name: 'BBQ Night Out',
    tag: 'BBQ', tagIcon: '🔥',
    badge: 'SMOKY HOT', badgeColor: '#dc2626',
    description: 'A sizzling BBQ night for two! Smoked honey ribs, grilled chicken platter, loaded fries and two mojitos.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80',
    items: [
      { dishId:'bbq-ribs', name:'Honey-Glazed Short Ribs', qty:1 },
      { dishId:'bbq-chicken-platter', name:'BBQ Chicken Platter', qty:1 },
      { dishId:'fast-loaded-fries', name:'Loaded Cheese Fries', qty:1 },
      { dishId:'drinks-gold-mojito', name:'24K Gold Royal Mojito', qty:2 }
    ],
    originalPrice:109, comboPrice:79, saves:30,
    servings:'2-3 Persons', cookingTime:'35 mins', popular:true
  },
  {
    id: 'combo-lunch-special',
    name: 'Lunch Special',
    tag: 'Lunch', tagIcon: '☀️',
    badge: 'WEEKDAY', badgeColor: '#f59e0b',
    description: 'Quick and satisfying weekday lunch! A juicy burger, fresh salad and a refreshing drink.',
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&q=80',
    items: [
      { dishId:'burger-crispy-chicken', name:'Crispy Chicken Burger', qty:1 },
      { dishId:'salad-caesar', name:'Caesar Salad', qty:1 },
      { dishId:'drinks-fresh-juice', name:'Fresh Juice Blend', qty:1 }
    ],
    originalPrice:43, comboPrice:29, saves:14,
    servings:'1 Person', cookingTime:'15 mins', popular:false
  },
  {
    id: 'combo-student-deal',
    name: 'Student Deal',
    tag: 'Budget', tagIcon: '🎓',
    badge: 'BUDGET PICK', badgeColor: '#059669',
    description: 'Maximum taste, minimum budget! A hearty burger, classic fries and a drink.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    items: [
      { dishId:'burger-crispy-chicken', name:'Crispy Chicken Burger', qty:1 },
      { dishId:'fast-hotdog', name:'Gourmet Chicago Hot Dog', qty:1 },
      { dishId:'drinks-fresh-juice', name:'Fresh Juice Blend', qty:1 }
    ],
    originalPrice:39, comboPrice:25, saves:14,
    servings:'1-2 Persons', cookingTime:'12 mins', popular:false
  }
];
