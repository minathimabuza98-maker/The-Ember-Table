import { MenuItem } from './types';

export const MENU: MenuItem[] = [
  // STARTERS
  { id: 'S01', name: 'Ember Bread', price: 69, emoji: '🍞', calories: 320, description: 'Freshly baked sourdough with herb butter, roasted garlic, and smoked paprika oil.', rating: 4.7, tags: ['veg'], category: 'Starters' },
  { id: 'S02', name: 'Peri-Peri Wings', price: 89, emoji: '🍗', calories: 380, description: '6 crispy wings tossed in house peri-peri sauce. Choose mild, hot, or extra hot.', rating: 4.9, tags: ['hot', 'popular'], category: 'Starters' },
  { id: 'S03', name: 'Biltong Salad', price: 79, emoji: '🥗', calories: 280, description: 'Mixed greens, cherry tomatoes, avocado, dried mango, and hand-sliced beef biltong.', rating: 4.6, tags: ['new'], category: 'Starters' },
  
  // MAINS
  { id: 'M01', name: 'Ember Chicken Quarter', price: 149, emoji: '🍗', calories: 480, description: 'Free-range chicken marinated in our 3-generation spice blend. Served with pap and chakalaka.', rating: 4.8, tags: ['hot', 'popular'], category: 'Mains' },
  { id: 'M02', name: 'Grilled Linefish', price: 179, emoji: '🐟', calories: 340, description: 'Fresh catch of the day grilled over wood coals with lemon, capers and herb butter.', rating: 4.7, tags: ['new'], category: 'Mains' },
  { id: 'M03', name: 'Veggie Flame Bowl', price: 129, emoji: '🥗', calories: 420, description: 'Seasonal roasted vegetables, halloumi, quinoa, and house tahini dressing.', rating: 4.6, tags: ['veg', 'new'], category: 'Mains' },
  { id: 'M04', name: 'The Ember Burger', price: 159, emoji: '🍔', calories: 650, description: '180g wood-grilled beef patty, smoked cheddar, caramelised onion, ember mayo, brioche bun.', rating: 4.8, tags: ['hot', 'popular'], category: 'Mains' },

  // GRILLS
  { id: 'G01', name: 'Wood-Fired Lamb Chops', price: 189, emoji: '🥩', calories: 520, description: '3 marinated lamb chops slow-cooked over apple wood. Served with garlic butter.', rating: 4.9, tags: ['hot', 'popular'], category: 'Grills' },
  { id: 'G02', name: 'Wood-Fired Beef Ribs', price: 229, emoji: '🍖', calories: 680, description: '600g bone-in beef ribs rubbed and smoked for 6 hours. Fall-off-the-bone tender.', rating: 5.0, tags: ['hot', 'popular'], category: 'Grills' },
  { id: 'G03', name: 'T-Bone Steak', price: 249, emoji: '🥩', calories: 720, description: '400g T-bone grilled to your preference on wood coals. Served with chimichurri.', rating: 4.8, tags: ['hot'], category: 'Grills' },
  { id: 'G04', name: 'Mixed Grill Platter', price: 279, emoji: '🍖', calories: 880, description: 'Lamb chop, boerewors, chicken quarter, and beef rib. Feeds 1-2 people.', rating: 4.9, tags: ['popular'], category: 'Grills' },

  // SIDES
  { id: 'SI1', name: 'Pap & Chakalaka', price: 69, emoji: '🫕', calories: 310, description: 'Traditional maize pap with house-made chakalaka and butter.', rating: 4.7, tags: ['veg'], category: 'Sides' },
  { id: 'SI2', name: 'Hand-Cut Chips', price: 59, emoji: '🍟', calories: 380, description: 'Thick-cut potatoes fried in sunflower oil with Himalayan salt.', rating: 4.6, tags: [], category: 'Sides' },
  { id: 'SI3', name: 'Braai Corn', price: 55, emoji: '🌽', calories: 210, description: 'Whole corn grilled on coals with chilli butter and parmesan.', rating: 4.8, tags: ['veg', 'new'], category: 'Sides' },

  // DESSERTS
  { id: 'DS1', name: 'Warm Malva Pudding', price: 89, emoji: '🍮', calories: 480, description: 'Classic SA malva pudding served warm with vanilla custard.', rating: 5.0, tags: ['hot', 'new'], category: 'Desserts' },
  { id: 'DS2', name: 'Milk Tart', price: 75, emoji: '🥧', calories: 420, description: 'Traditional South African milk tart, dusted with cinnamon.', rating: 4.8, tags: [], category: 'Desserts' },
  { id: 'DS3', name: 'Chocolate Fondant', price: 95, emoji: '🍫', calories: 540, description: 'Warm dark chocolate fondant with a molten centre. Vanilla ice.', rating: 4.9, tags: ['new'], category: 'Desserts' },
];

export const RESTAURANT_INFO = {
  name: 'The Ember Table',
  tagline: 'Wood-Fired Kitchen Since 2012',
  phone: '+27 21 123 4567',
  whatsapp: '27820000000',
  email: 'hello@embertable.co.za',
  address: '14 Flame Street, Woodstock, Cape Town',
  coords: { lat: -33.9249, lng: 18.4241 },
  hours: [
    { day: 'Monday', time: 'CLOSED', isOpen: false },
    { day: 'Tuesday', time: '11:00 – 22:00', isOpen: true },
    { day: 'Wednesday', time: '11:00 – 22:00', isOpen: true },
    { day: 'Thursday', time: '11:00 – 23:00', isOpen: true },
    { day: 'Friday', time: '11:00 – 23:30', isOpen: true },
    { day: 'Saturday', time: '10:00 – 23:30', isOpen: true },
    { day: 'Sunday', time: '10:00 – 21:00', isOpen: true },
  ]
};
