// ============================================================
// MOCK DATA — Miabé Assimé
// ============================================================

export const REGIONS = ['Lomé', 'Kpalimé', 'Atakpamé', 'Sokodé', 'Dapaong', 'Kara', 'Tsévié'];

export const CATEGORIES = ['Céréales', 'Tubercules', 'Légumes', 'Fruits', 'Légumineuses', 'Épices', 'Coton'];

// ---- FARMERS ----
export const farmers = [
  {
    id: 'f1', name: 'Kofi Mensah', role: 'farmer', region: 'Kpalimé',
    phone: '+228 91 23 45 67', avatar: '/avatars/farmer-kofi.jpg',
    rating: 4.8, reviews: 42, verified: true, joinedDate: '2023-03-15',
    bio: 'Agriculteur certifié depuis 15 ans, spécialisé en maïs et manioc bio.',
    email: 'kofi@miabe.tg', password: 'demo123',
    lat: 6.9024, lng: 0.6245,
  },
  {
    id: 'f2', name: 'Abla Kodjo', role: 'farmer', region: 'Atakpamé',
    phone: '+228 92 34 56 78', avatar: '/avatars/farmer-yawa.jpg',
    rating: 4.6, reviews: 28, verified: true, joinedDate: '2023-07-22',
    bio: 'Productrice de tomates et piments, agriculture familiale durable.',
    email: 'abla@miabe.tg', password: 'demo123',
    lat: 7.5353, lng: 1.1291,
  },
  {
    id: 'f3', name: 'Yao Agbeko', role: 'farmer', region: 'Sokodé',
    phone: '+228 93 45 67 89', avatar: '/avatars/user-young-man.jpg',
    rating: 4.9, reviews: 65, verified: true, joinedDate: '2022-11-01',
    bio: 'Grand producteur de riz et d\'igname dans la région Centrale.',
    email: 'yao@miabe.tg', password: 'demo123',
    lat: 8.9776, lng: 1.1436,
  },
  {
    id: 'f4', name: 'Ama Dossou', role: 'farmer', region: 'Dapaong',
    phone: '+228 94 56 78 90', avatar: '/avatars/farmer-yawa.jpg',
    rating: 4.7, reviews: 33, verified: false, joinedDate: '2024-01-10',
    bio: 'Productrice d\'arachides et de soja dans la région des Savanes.',
    email: 'ama@miabe.tg', password: 'demo123',
    lat: 10.8671, lng: 0.2087,
  },
  {
    id: 'f5', name: 'Komi Adzah', role: 'farmer', region: 'Lomé',
    phone: '+228 95 67 89 01', avatar: '/avatars/farmer-kofi.jpg',
    rating: 4.5, reviews: 19, verified: true, joinedDate: '2024-04-05',
    bio: 'Maraîcher périurbain, légumes frais livrés en 24h sur Lomé.',
    email: 'komi@miabe.tg', password: 'demo123',
    lat: 6.1375, lng: 1.2123,
  },
];

// ---- MERCHANTS ----
export const merchants = [
  {
    id: 'm1', name: 'Aissata Diallo', role: 'merchant', region: 'Lomé',
    phone: '+228 77 12 34 56', avatar: '/avatars/merchant-aissata.png',
    rating: 4.7, reviews: 18, verified: true,
    email: 'aissata@miabe.tg', password: 'demo123',
    bio: 'Commerçante spécialisée en produits vivriers, marché Grand Lomé.',
  },
  {
    id: 'm2', name: 'Ibrahim Touré', role: 'merchant', region: 'Kpalimé',
    phone: '+228 77 23 45 67', avatar: '/avatars/user-young-man.jpg',
    rating: 4.4, reviews: 12, verified: false,
    email: 'ibrahim@miabe.tg', password: 'demo123',
    bio: 'Grossiste en céréales, revendeur sur les marchés régionaux.',
  },
];

// ---- TRANSPORTERS ----
export const transporters = [
  {
    id: 't1', name: 'Edem Tsekpo', role: 'transporter', region: 'Lomé',
    phone: '+228 90 11 22 33', avatar: '/avatars/transporter-edem.jpg',
    truckType: 'Camion 5T', capacity: '5000 kg', pricePerKm: 350,
    available: true, rating: 4.9, reviews: 87,
    routes: ['Lomé → Kpalimé', 'Lomé → Atakpamé', 'Lomé → Tsévié'],
    schedule: 'Lun-Sam 06:00–18:00',
    lat: 6.1721, lng: 1.2313,
    email: 'edem@miabe.tg', password: 'demo123',
    plateNumber: 'TG-2847-A',
  },
  {
    id: 't2', name: 'Sélom Agbo', role: 'transporter', region: 'Atakpamé',
    phone: '+228 90 22 33 44', avatar: '/avatars/user-young-man.jpg',
    truckType: 'Camionnette 2T', capacity: '2000 kg', pricePerKm: 200,
    available: true, rating: 4.6, reviews: 45,
    routes: ['Atakpamé → Sokodé', 'Atakpamé → Lomé'],
    schedule: 'Mar-Dim 07:00–17:00',
    lat: 7.5820, lng: 1.1678,
    email: 'selom@miabe.tg', password: 'demo123',
    plateNumber: 'TG-1533-B',
  },
  {
    id: 't3', name: 'Dodji Kpossou', role: 'transporter', region: 'Sokodé',
    phone: '+228 90 33 44 55', avatar: '/avatars/transporter-edem.jpg',
    truckType: 'Camion 10T', capacity: '10000 kg', pricePerKm: 500,
    available: false, rating: 4.8, reviews: 120,
    routes: ['Sokodé → Dapaong', 'Sokodé → Kara', 'Sokodé → Lomé'],
    schedule: 'Lun-Ven 05:00–16:00',
    lat: 9.0246, lng: 1.1521,
    email: 'dodji@miabe.tg', password: 'demo123',
    plateNumber: 'TG-4421-C',
  },
  {
    id: 't4', name: 'Mawule Attivor', role: 'transporter', region: 'Kara',
    phone: '+228 90 44 55 66', avatar: '/avatars/user-young-man.jpg',
    truckType: 'Pick-up Réfrigéré', capacity: '800 kg', pricePerKm: 450,
    available: true, rating: 4.7, reviews: 34,
    routes: ['Kara → Sokodé', 'Kara → Lomé'],
    schedule: 'Lun-Sam 06:00–19:00',
    lat: 9.5505, lng: 1.1864,
    email: 'mawule@miabe.tg', password: 'demo123',
    plateNumber: 'TG-3309-D',
  },
];

// ---- PRODUCTS ----
export const products = [
  {
    id: 'p1', name: 'Maïs Blanc', nameEn: 'White Corn', nameEwe: 'Bli Ɣie', category: 'Céréales', farmerId: 'f1',
    price: 180, unit: 'kg', quantity: 2500,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600&q=80&fit=crop',
    region: 'Kpalimé', description: 'Maïs blanc séché de qualité supérieure, récolte de la saison. Idéal pour la farine et la consommation directe.',
    rating: 4.8, reviews: 24, createdAt: '2025-08-10', verified: true,
  },
  {
    id: 'p2', name: 'Manioc Frais', nameEn: 'Fresh Cassava', nameEwe: 'Agbeli Mumue', category: 'Tubercules', farmerId: 'f1',
    price: 120, unit: 'kg', quantity: 800,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80&fit=crop',
    region: 'Kpalimé', description: 'Manioc frais en tubercules fermes, variété douce. Parfait pour le foufou, le gari et préparations locales.',
    rating: 4.6, reviews: 18, createdAt: '2025-08-15', verified: true,
  },
  {
    id: 'p3', name: 'Tomates Roma', nameEn: 'Roma Tomatoes', nameEwe: 'Tomatoe', category: 'Légumes', farmerId: 'f2',
    price: 450, unit: 'kg', quantity: 350,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80&fit=crop',
    region: 'Atakpamé', description: 'Tomates Roma fraîches bien fermes, cultivées sans pesticides chimiques. Excellentes pour sauces et conservation.',
    rating: 4.9, reviews: 35, createdAt: '2025-08-20', verified: true,
  },
  {
    id: 'p4', name: 'Piment Frais', nameEn: 'Fresh Chili Pepper', nameEwe: 'Atadi Mumue', category: 'Épices', farmerId: 'f2',
    price: 600, unit: 'kg', quantity: 150,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&q=80&fit=crop',
    region: 'Atakpamé', description: 'Piment rouge et vert frais très piquant, récolté à pleine maturité. Parfait pour les assaisonnements.',
    rating: 4.7, reviews: 21, createdAt: '2025-08-18', verified: true,
  },
  {
    id: 'p5', name: 'Igname Blanc', nameEn: 'White Yam', nameEwe: 'Te Ɣie', category: 'Tubercules', farmerId: 'f3',
    price: 220, unit: 'kg', quantity: 3000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&q=80&fit=crop',
    region: 'Sokodé', description: 'Tubercules d\'igname blanc de grande taille, variété Dente. Chair blanche, très prisée sur tous les marchés.',
    rating: 4.9, reviews: 42, createdAt: '2025-07-28', verified: true,
  },
  {
    id: 'p6', name: 'Riz Local', nameEn: 'Local Rice', nameEwe: 'Molu', category: 'Céréales', farmerId: 'f3',
    price: 350, unit: 'kg', quantity: 5000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80&fit=crop',
    region: 'Sokodé', description: 'Riz blanc local de la plaine de Sokodé, grains entiers décortiqués et nettoyés. Cuisson rapide et parfumée.',
    rating: 4.9, reviews: 28, createdAt: '2025-08-01', verified: true,
  },
  {
    id: 'p7', name: 'Arachides Décortiquées', nameEn: 'Shelled Peanuts', nameEwe: 'Azi', category: 'Légumineuses', farmerId: 'f4',
    price: 800, unit: 'kg', quantity: 600,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&q=80&fit=crop',
    region: 'Dapaong', description: 'Graines d\'arachides sèches décortiquées, prêtes pour huilerie, pâte d\'arachide ou vente au détail.',
    rating: 4.8, reviews: 30, createdAt: '2025-08-22', verified: false,
  },
  {
    id: 'p8', name: 'Soja Grain', nameEn: 'Soybeans', nameEwe: 'Soja', category: 'Céréales', farmerId: 'f4',
    price: 500, unit: 'kg', quantity: 1200,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80&fit=crop',
    region: 'Dapaong', description: 'Graines de soja sèches, triées et ensachées. Qualité supérieure riche en protéines végétales.',
    rating: 4.7, reviews: 15, createdAt: '2025-08-12', verified: false,
  },
  {
    id: 'p9', name: 'Plantain Mûr', nameEn: 'Ripe Plantain', nameEwe: 'Ablada Bi', category: 'Fruits', farmerId: 'f5',
    price: 280, unit: 'kg', quantity: 400,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80&fit=crop',
    region: 'Lomé', description: 'Banane plantain mûre de premier choix, doigts longs. Idéale pour alloco et friture.',
    rating: 4.7, reviews: 22, createdAt: '2025-08-25', verified: true,
  },
  {
    id: 'p10', name: 'Oignons Bulbe', nameEn: 'Onion Bulbs', nameEwe: 'Sabala', category: 'Légumes', farmerId: 'f5',
    price: 400, unit: 'kg', quantity: 0,
    status: 'out',
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&q=80&fit=crop',
    region: 'Lomé', description: 'Oignons bulbes bien secs, calibre extra. Excellente conservation pour grossistes.',
    rating: 4.5, reviews: 16, createdAt: '2025-07-15', verified: true,
  },
  {
    id: 'p11', name: 'Gingembre Frais', nameEn: 'Fresh Ginger', nameEwe: 'Dotɛ Mumue', category: 'Épices', farmerId: 'f2',
    price: 1200, unit: 'kg', quantity: 200,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80&fit=crop',
    region: 'Atakpamé', description: 'Rhizomes de gingembre frais, très aromatiques et juteux. Récolte récente des Plateaux.',
    rating: 4.9, reviews: 41, createdAt: '2025-08-28', verified: true,
  },
  {
    id: 'p12', name: 'Coton Graine', nameEn: 'Raw Cotton Seed', nameEwe: 'Deti Ku', category: 'Coton', farmerId: 'f3',
    price: 270, unit: 'kg', quantity: 8000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80&fit=crop',
    region: 'Sokodé', description: 'Fleurs et graines de coton brut de qualité A, capsules bien épanouies prêtes pour égrenage.',
    rating: 4.6, reviews: 9, createdAt: '2025-08-08', verified: true,
  },
  {
    id: 'p13', name: 'Sorgho Rouge', nameEn: 'Red Sorghum', nameEwe: 'Atiha Dzĩ', category: 'Céréales', farmerId: 'f1',
    price: 260, unit: 'kg', quantity: 3500,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80&fit=crop',
    region: 'Kara', description: 'Sorgho rouge en grains secs de la région de Kara. Idéal pour boissons locales et farines nutritives.',
    rating: 4.8, reviews: 19, createdAt: '2025-08-26', verified: true,
  },
  {
    id: 'p14', name: 'Niébé (Haricots)', nameEn: 'Cowpeas / Beans', nameEwe: 'Ayi / Atsio', category: 'Légumineuses', farmerId: 'f4',
    price: 480, unit: 'kg', quantity: 2200,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&q=80&fit=crop',
    region: 'Savanes', description: 'Haricots niébé blancs à œil noir, grains sains et secs, triés à la main sans charançons.',
    rating: 4.9, reviews: 27, createdAt: '2025-08-29', verified: true,
  },
];

// ---- ORDERS ----
export const initialOrders = [
  {
    id: 'o1', merchantId: 'm1', productId: 'p1', farmerId: 'f1',
    quantity: 500, totalPrice: 90000, status: 'delivered',
    address: 'Marché de Bè, Lomé', createdAt: '2025-08-01', transporterId: 't1',
    note: 'Livraison urgente',
  },
  {
    id: 'o2', merchantId: 'm1', productId: 'p3', farmerId: 'f2',
    quantity: 100, totalPrice: 45000, status: 'transit',
    address: 'Marché de Bè, Lomé', createdAt: '2025-08-20', transporterId: 't2',
    note: '',
  },
  {
    id: 'o3', merchantId: 'm1', productId: 'p5', farmerId: 'f3',
    quantity: 300, totalPrice: 66000, status: 'pending',
    address: 'Dépôt Central, Lomé', createdAt: '2025-08-28', transporterId: null,
    note: 'Attente de transporteur',
  },
  {
    id: 'o4', merchantId: 'm2', productId: 'p7', farmerId: 'f4',
    quantity: 200, totalPrice: 160000, status: 'delivered',
    address: 'Marché de Kpalimé', createdAt: '2025-07-15', transporterId: 't3',
    note: '',
  },
];

// ---- CHAT MESSAGES ----
export const initialMessages = {
  'f1-m1': [
    { id: 'msg1', from: 'm1', to: 'f1', text: 'Bonjour Kofi, quel est votre prix pour 500kg de maïs ?', time: '09:15', date: '2025-08-20' },
    { id: 'msg2', from: 'f1', to: 'm1', text: 'Bonjour Aissata ! Pour 500kg, je vous propose 175 FCFA/kg.', time: '09:22', date: '2025-08-20' },
    { id: 'msg3', from: 'm1', to: 'f1', text: 'C\'est un peu cher. On peut s\'entendre à 165 FCFA/kg ?', time: '09:30', date: '2025-08-20' },
    { id: 'msg4', from: 'f1', to: 'm1', text: 'Accord pour 170 FCFA/kg, livraison incluse jusqu\'à Lomé.', time: '09:45', date: '2025-08-20' },
    { id: 'msg5', from: 'm1', to: 'f1', text: 'Parfait ! Je vais chercher un transporteur et je vous confirme.', time: '09:47', date: '2025-08-20' },
  ],
  'f2-m1': [
    { id: 'msg6', from: 'm1', to: 'f2', text: 'Abla, vous avez des tomates fraîches cette semaine ?', time: '14:00', date: '2025-08-22' },
    { id: 'msg7', from: 'f2', to: 'm1', text: 'Oui ! 350kg disponibles. Récoltées ce matin.', time: '14:05', date: '2025-08-22' },
    { id: 'msg8', from: 'm1', to: 'f2', text: 'Je prends 100kg. Pouvez-vous livrer jeudi ?', time: '14:10', date: '2025-08-22' },
  ],
};

// ---- PRICE HISTORY (for charts) ----
export const priceHistory = {
  'Maïs Blanc': [
    { date: 'Jan', price: 150 }, { date: 'Fév', price: 155 }, { date: 'Mar', price: 160 },
    { date: 'Avr', price: 175 }, { date: 'Mai', price: 190 }, { date: 'Jun', price: 185 },
    { date: 'Jul', price: 170 }, { date: 'Aoû', price: 180 }, { date: 'Sep', price: 178 },
    { date: 'Oct', price: 165 }, { date: 'Nov', price: 158 }, { date: 'Déc', price: 162 },
  ],
  'Manioc Frais': [
    { date: 'Jan', price: 100 }, { date: 'Fév', price: 105 }, { date: 'Mar', price: 110 },
    { date: 'Avr', price: 125 }, { date: 'Mai', price: 130 }, { date: 'Jun', price: 120 },
    { date: 'Jul', price: 115 }, { date: 'Aoû', price: 120 }, { date: 'Sep', price: 118 },
    { date: 'Oct', price: 112 }, { date: 'Nov', price: 108 }, { date: 'Déc', price: 110 },
  ],
  'Tomates Roma': [
    { date: 'Jan', price: 380 }, { date: 'Fév', price: 400 }, { date: 'Mar', price: 420 },
    { date: 'Avr', price: 480 }, { date: 'Mai', price: 520 }, { date: 'Jun', price: 490 },
    { date: 'Jul', price: 440 }, { date: 'Aoû', price: 450 }, { date: 'Sep', price: 460 },
    { date: 'Oct', price: 430 }, { date: 'Nov', price: 415 }, { date: 'Déc', price: 395 },
  ],
  'Igname Blanc': [
    { date: 'Jan', price: 200 }, { date: 'Fév', price: 210 }, { date: 'Mar', price: 230 },
    { date: 'Avr', price: 250 }, { date: 'Mai', price: 270 }, { date: 'Jun', price: 260 },
    { date: 'Jul', price: 240 }, { date: 'Aoû', price: 220 }, { date: 'Sep', price: 215 },
    { date: 'Oct', price: 210 }, { date: 'Nov', price: 205 }, { date: 'Déc', price: 200 },
  ],
  'Riz Local': [
    { date: 'Jan', price: 320 }, { date: 'Fév', price: 330 }, { date: 'Mar', price: 340 },
    { date: 'Avr', price: 360 }, { date: 'Mai', price: 380 }, { date: 'Jun', price: 370 },
    { date: 'Jul', price: 355 }, { date: 'Aoû', price: 350 }, { date: 'Sep', price: 348 },
    { date: 'Oct', price: 340 }, { date: 'Nov', price: 332 }, { date: 'Déc', price: 328 },
  ],
  'Arachides Décortiquées': [
    { date: 'Jan', price: 700 }, { date: 'Fév', price: 720 }, { date: 'Mar', price: 740 },
    { date: 'Avr', price: 780 }, { date: 'Mai', price: 820 }, { date: 'Jun', price: 800 },
    { date: 'Jul', price: 790 }, { date: 'Aoû', price: 800 }, { date: 'Sep', price: 795 },
    { date: 'Oct', price: 780 }, { date: 'Nov', price: 760 }, { date: 'Déc', price: 740 },
  ],
};

// ---- TOGO REGIONS FOR CEREAL PRICE ANALYSIS ----
export const TOGO_REGIONS = [
  { id: 'maritime', name: 'Maritime (Lomé)', color: '#15803d' },
  { id: 'plateaux', name: 'Plateaux (Kpalimé, Atakpamé)', color: '#d97706' },
  { id: 'centrale', name: 'Centrale (Sokodé)', color: '#2563eb' },
  { id: 'kara', name: 'Kara', color: '#9333ea' },
  { id: 'savanes', name: 'Savanes (Dapaong)', color: '#e11d48' },
];

export const CEREALS_LIST = ['Maïs Blanc', 'Riz Local', 'Sorgho', 'Mil'];

export const regionalCerealPriceHistory = {
  'Maïs Blanc': {
    maritime: [
      { date: 'Jan', price: 185 }, { date: 'Fév', price: 190 }, { date: 'Mar', price: 195 },
      { date: 'Avr', price: 210 }, { date: 'Mai', price: 230 }, { date: 'Jun', price: 220 },
      { date: 'Jul', price: 205 }, { date: 'Aoû', price: 215 }, { date: 'Sep', price: 210 },
      { date: 'Oct', price: 195 }, { date: 'Nov', price: 185 }, { date: 'Déc', price: 190 },
    ],
    plateaux: [
      { date: 'Jan', price: 140 }, { date: 'Fév', price: 145 }, { date: 'Mar', price: 150 },
      { date: 'Avr', price: 165 }, { date: 'Mai', price: 180 }, { date: 'Jun', price: 175 },
      { date: 'Jul', price: 160 }, { date: 'Aoû', price: 170 }, { date: 'Sep', price: 168 },
      { date: 'Oct', price: 155 }, { date: 'Nov', price: 145 }, { date: 'Déc', price: 150 },
    ],
    centrale: [
      { date: 'Jan', price: 135 }, { date: 'Fév', price: 140 }, { date: 'Mar', price: 145 },
      { date: 'Avr', price: 160 }, { date: 'Mai', price: 175 }, { date: 'Jun', price: 170 },
      { date: 'Jul', price: 155 }, { date: 'Aoû', price: 165 }, { date: 'Sep', price: 160 },
      { date: 'Oct', price: 150 }, { date: 'Nov', price: 140 }, { date: 'Déc', price: 145 },
    ],
    kara: [
      { date: 'Jan', price: 155 }, { date: 'Fév', price: 160 }, { date: 'Mar', price: 165 },
      { date: 'Avr', price: 180 }, { date: 'Mai', price: 195 }, { date: 'Jun', price: 190 },
      { date: 'Jul', price: 175 }, { date: 'Aoû', price: 185 }, { date: 'Sep', price: 182 },
      { date: 'Oct', price: 170 }, { date: 'Nov', price: 162 }, { date: 'Déc', price: 165 },
    ],
    savanes: [
      { date: 'Jan', price: 150 }, { date: 'Fév', price: 155 }, { date: 'Mar', price: 162 },
      { date: 'Avr', price: 185 }, { date: 'Mai', price: 205 }, { date: 'Jun', price: 200 },
      { date: 'Jul', price: 180 }, { date: 'Aoû', price: 190 }, { date: 'Sep', price: 188 },
      { date: 'Oct', price: 172 }, { date: 'Nov', price: 160 }, { date: 'Déc', price: 168 },
    ],
  },
  'Riz Local': {
    maritime: [
      { date: 'Jan', price: 380 }, { date: 'Fév', price: 390 }, { date: 'Mar', price: 400 },
      { date: 'Avr', price: 420 }, { date: 'Mai', price: 440 }, { date: 'Jun', price: 430 },
      { date: 'Jul', price: 415 }, { date: 'Aoû', price: 410 }, { date: 'Sep', price: 405 },
      { date: 'Oct', price: 395 }, { date: 'Nov', price: 385 }, { date: 'Déc', price: 390 },
    ],
    plateaux: [
      { date: 'Jan', price: 310 }, { date: 'Fév', price: 320 }, { date: 'Mar', price: 330 },
      { date: 'Avr', price: 350 }, { date: 'Mai', price: 370 }, { date: 'Jun', price: 360 },
      { date: 'Jul', price: 345 }, { date: 'Aoû', price: 340 }, { date: 'Sep', price: 335 },
      { date: 'Oct', price: 325 }, { date: 'Nov', price: 318 }, { date: 'Déc', price: 320 },
    ],
    centrale: [
      { date: 'Jan', price: 295 }, { date: 'Fév', price: 305 }, { date: 'Mar', price: 315 },
      { date: 'Avr', price: 335 }, { date: 'Mai', price: 355 }, { date: 'Jun', price: 345 },
      { date: 'Jul', price: 330 }, { date: 'Aoû', price: 325 }, { date: 'Sep', price: 320 },
      { date: 'Oct', price: 310 }, { date: 'Nov', price: 302 }, { date: 'Déc', price: 305 },
    ],
    kara: [
      { date: 'Jan', price: 325 }, { date: 'Fév', price: 335 }, { date: 'Mar', price: 345 },
      { date: 'Avr', price: 365 }, { date: 'Mai', price: 385 }, { date: 'Jun', price: 375 },
      { date: 'Jul', price: 360 }, { date: 'Aoû', price: 355 }, { date: 'Sep', price: 350 },
      { date: 'Oct', price: 340 }, { date: 'Nov', price: 330 }, { date: 'Déc', price: 335 },
    ],
    savanes: [
      { date: 'Jan', price: 330 }, { date: 'Fév', price: 340 }, { date: 'Mar', price: 350 },
      { date: 'Avr', price: 375 }, { date: 'Mai', price: 395 }, { date: 'Jun', price: 385 },
      { date: 'Jul', price: 370 }, { date: 'Aoû', price: 365 }, { date: 'Sep', price: 360 },
      { date: 'Oct', price: 350 }, { date: 'Nov', price: 340 }, { date: 'Déc', price: 345 },
    ],
  },
  'Sorgho': {
    maritime: [
      { date: 'Jan', price: 260 }, { date: 'Fév', price: 270 }, { date: 'Mar', price: 280 },
      { date: 'Avr', price: 300 }, { date: 'Mai', price: 320 }, { date: 'Jun', price: 315 },
      { date: 'Jul', price: 300 }, { date: 'Aoû', price: 295 }, { date: 'Sep', price: 290 },
      { date: 'Oct', price: 280 }, { date: 'Nov', price: 270 }, { date: 'Déc', price: 275 },
    ],
    plateaux: [
      { date: 'Jan', price: 210 }, { date: 'Fév', price: 215 }, { date: 'Mar', price: 225 },
      { date: 'Avr', price: 245 }, { date: 'Mai', price: 265 }, { date: 'Jun', price: 260 },
      { date: 'Jul', price: 245 }, { date: 'Aoû', price: 240 }, { date: 'Sep', price: 235 },
      { date: 'Oct', price: 225 }, { date: 'Nov', price: 218 }, { date: 'Déc', price: 220 },
    ],
    centrale: [
      { date: 'Jan', price: 185 }, { date: 'Fév', price: 190 }, { date: 'Mar', price: 200 },
      { date: 'Avr', price: 220 }, { date: 'Mai', price: 240 }, { date: 'Jun', price: 235 },
      { date: 'Jul', price: 220 }, { date: 'Aoû', price: 215 }, { date: 'Sep', price: 210 },
      { date: 'Oct', price: 200 }, { date: 'Nov', price: 192 }, { date: 'Déc', price: 195 },
    ],
    kara: [
      { date: 'Jan', price: 195 }, { date: 'Fév', price: 200 }, { date: 'Mar', price: 210 },
      { date: 'Avr', price: 230 }, { date: 'Mai', price: 250 }, { date: 'Jun', price: 245 },
      { date: 'Jul', price: 230 }, { date: 'Aoû', price: 225 }, { date: 'Sep', price: 220 },
      { date: 'Oct', price: 210 }, { date: 'Nov', price: 202 }, { date: 'Déc', price: 205 },
    ],
    savanes: [
      { date: 'Jan', price: 180 }, { date: 'Fév', price: 185 }, { date: 'Mar', price: 195 },
      { date: 'Avr', price: 215 }, { date: 'Mai', price: 235 }, { date: 'Jun', price: 230 },
      { date: 'Jul', price: 215 }, { date: 'Aoû', price: 210 }, { date: 'Sep', price: 205 },
      { date: 'Oct', price: 195 }, { date: 'Nov', price: 188 }, { date: 'Déc', price: 190 },
    ],
  },
  'Mil': {
    maritime: [
      { date: 'Jan', price: 290 }, { date: 'Fév', price: 300 }, { date: 'Mar', price: 310 },
      { date: 'Avr', price: 330 }, { date: 'Mai', price: 350 }, { date: 'Jun', price: 340 },
      { date: 'Jul', price: 325 }, { date: 'Aoû', price: 320 }, { date: 'Sep', price: 315 },
      { date: 'Oct', price: 305 }, { date: 'Nov', price: 295 }, { date: 'Déc', price: 300 },
    ],
    plateaux: [
      { date: 'Jan', price: 240 }, { date: 'Fév', price: 250 }, { date: 'Mar', price: 260 },
      { date: 'Avr', price: 280 }, { date: 'Mai', price: 300 }, { date: 'Jun', price: 290 },
      { date: 'Jul', price: 275 }, { date: 'Aoû', price: 270 }, { date: 'Sep', price: 265 },
      { date: 'Oct', price: 255 }, { date: 'Nov', price: 245 }, { date: 'Déc', price: 250 },
    ],
    centrale: [
      { date: 'Jan', price: 215 }, { date: 'Fév', price: 225 }, { date: 'Mar', price: 235 },
      { date: 'Avr', price: 255 }, { date: 'Mai', price: 275 }, { date: 'Jun', price: 265 },
      { date: 'Jul', price: 250 }, { date: 'Aoû', price: 245 }, { date: 'Sep', price: 240 },
      { date: 'Oct', price: 230 }, { date: 'Nov', price: 220 }, { date: 'Déc', price: 225 },
    ],
    kara: [
      { date: 'Jan', price: 210 }, { date: 'Fév', price: 220 }, { date: 'Mar', price: 230 },
      { date: 'Avr', price: 250 }, { date: 'Mai', price: 270 }, { date: 'Jun', price: 260 },
      { date: 'Jul', price: 245 }, { date: 'Aoû', price: 240 }, { date: 'Sep', price: 235 },
      { date: 'Oct', price: 225 }, { date: 'Nov', price: 215 }, { date: 'Déc', price: 220 },
    ],
    savanes: [
      { date: 'Jan', price: 200 }, { date: 'Fév', price: 210 }, { date: 'Mar', price: 220 },
      { date: 'Avr', price: 240 }, { date: 'Mai', price: 260 }, { date: 'Jun', price: 250 },
      { date: 'Jul', price: 235 }, { date: 'Aoû', price: 230 }, { date: 'Sep', price: 225 },
      { date: 'Oct', price: 215 }, { date: 'Nov', price: 205 }, { date: 'Déc', price: 210 },
    ],
  },
};

// ---- TESTIMONIALS ----
export const testimonials = [
  {
    id: 1, name: 'Kofi Mensah',
    role: 'Agriculteur, Kpalimé',
    roleEn: 'Farmer, Kpalimé',
    roleEwe: 'Agbletɔ, Kpalimé',
    text: 'Grâce à Miabé Assimé, j\'ai triplé mes ventes en 6 mois. Je trouve facilement des commerçants sérieux.',
    textEn: 'Thanks to Miabé Assimé, I tripled my sales in 6 months. I easily connect with reliable wholesale buyers.',
    textEwe: 'To Miabé Assimé dzi la, me dzi nye dzadzrawo ɖe edzi teƒe etɔ̃ le ɣleti 6 me. Mekpɔa asitsatɔ nyuiwo bɔbɔe.',
    avatar: '/avatars/farmer-kofi.jpg',
    rating: 5,
  },
  {
    id: 2, name: 'Aissata Diallo',
    role: 'Commerçante, Lomé',
    roleEn: 'Wholesale Merchant, Lomé',
    roleEwe: 'Asitsatɔ, Lomé',
    text: 'L\'application m\'a permis de comparer les prix et de trouver les meilleurs fournisseurs. Le chat vocal est fantastique !',
    textEn: 'The platform helped me compare prices and secure top producers. The voice chat feature is wonderful!',
    textEwe: 'Dɔwɔnu sia kpe ɖe ŋunye me sɔ asixɔxɔwo hekpɔ agbletɔ nyuitɔwo. Gbe dzi dzeɖoɖo la nyo ŋutɔ!',
    avatar: '/avatars/merchant-aissata.png',
    rating: 5,
  },
  {
    id: 3, name: 'Edem Tsekpo',
    role: 'Transporteur, Lomé',
    roleEn: 'Transporter, Lomé',
    roleEwe: 'Lɔritɔ, Lomé',
    text: 'Je reçois des demandes de transport chaque semaine via la carte. Mon revenu a augmenté de 40%.',
    textEn: 'I receive steady transport bookings every week through the map. My monthly income increased by 40%.',
    textEwe: 'Mexɔa lɔrikuku ƒe dɔwo kwasiɖa sia kwasiɖa to anyigbatata dzi. Nye ga si mekpɔna dzi ɖe edzi 40%.',
    avatar: '/avatars/transporter-edem.jpg',
    rating: 4,
  },
];

// ---- DEMO USERS ----
export const demoUsers = [
  { ...farmers[0] },
  { ...farmers[1] },
  { ...merchants[0] },
  { ...transporters[0] },
];

// ---- STATS ----
export const siteStats = {
  farmers: 1247,
  products: 3582,
  orders: 8934,
  regions: 7,
};
