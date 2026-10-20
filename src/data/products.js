export const BUSINESS_CONFIG = {
  name: 'Restaurant Parrilladas y Polleria DON JOSE',
  shortName: 'Don José Pollería & Parrilladas',
  owner: 'CCARITA HILAHUANCCO JOSE',
  address: 'A.H. PROMUVI IV NUEVO ILO, MZ. 35 LOTE 20, ILO, MOQUEGUA',
  city: 'Ilo, Moquegua',
  adminWhatsApp: '51960447032', // Número para recibir los pedidos por WhatsApp
  adminDisplayPhone: '960 447 032',
  secondaryPhone: '953 953 533 / 959 578 182',
  yapeNumber: '960 447 032',
  yapeOwner: 'José Ccarita (Don José)',
  packaging: {
    taperPrice: 1.00, // S/ 1.00 por plato servido para llevar
    bagPrice: 0.50    // S/ 0.50 por pedido
  },
  deliveryZones: [
    { id: 'tienda', name: 'Separar pedido para llevar (Recojo en Tienda)', cost: 0 },
    { id: 'nuevo-ilo', name: 'Nuevo Ilo / PROMUVI', cost: 4.00 },
    { id: 'pampa', name: 'Pampa Inalámbrica', cost: 5.00 },
    { id: 'cercado', name: 'Cercado de Ilo / Garibaldi / Puerto', cost: 6.00 },
    { id: 'externo', name: 'Empresa Externa (Pagas la carrera al repartidor)', cost: 0 }
  ],
  pickupTimes: [
    'En 20 minutos',
    'En 30 minutos',
    'En 45 minutos',
    'En 1 hora',
    'Hora específica (indicar)'
  ]
};

export const CATEGORIES = [
  { id: 'todos', name: 'Todos los platos', icon: '🍽️' },
  { id: 'pollos', name: 'Pollos a la Brasa', icon: '🍗' },
  { id: 'parrilladas', name: 'Parrilladas y Carnes', icon: '🥩' },
  { id: 'extras', name: 'Platos Extras y Criollos', icon: '🥘' },
  { id: 'menu', name: 'Menú del Día', icon: '🍲' },
  { id: 'finde', name: 'Fines de Semana', icon: '🥓' },
  { id: 'bebidas', name: 'Bebidas, Chicha y Vinos', icon: '🥤' },
  { id: 'guarniciones', name: 'Guarniciones Extras', icon: '🍟' }
];

export const INITIAL_PRODUCTS = [
  // --- POLLOS A LA BRASA ---
  {
    id: 'pol-1',
    name: '1 Pollo a la Brasa Entero',
    category: 'pollos',
    price: 68.00,
    unit: 'Pollo entero + Papas + Ensalada',
    requiresTaper: true,
    taperCount: 2,
    popular: true,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
    description: 'Pollo a la brasa jugoso y dorado, incluye abundante porción de papas fritas y ensalada fresca con vinagreta artesanal.'
  },
  {
    id: 'pol-2',
    name: '1/8 Pollo a la Brasa Económico',
    category: 'pollos',
    price: 13.00,
    unit: '1/8 Pollo + Papas + Ensalada + Chaufa',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80',
    description: '1/8 de pollo a la brasa servido con papas fritas, arroz chaufa de la casa y ensalada.'
  },

  // --- PARRILLADAS ---
  {
    id: 'parr-1',
    name: 'Parrillada Don José (Especial)',
    category: 'parrilladas',
    price: 105.00,
    unit: 'Para 3 a 4 personas',
    requiresTaper: true,
    taperCount: 3,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Nuestra parrillada insignia: combinación de carnes selectas a la leña, costillar, pollo, chorizos y guarniciones abundantes.'
  },
  {
    id: 'parr-2',
    name: '1/2 Costillar a la Parrilla',
    category: 'parrilladas',
    price: 44.00,
    unit: 'Medio Costillar + Papas + Ensalada',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Tierno y jugoso medio costillar dorado a fuego lento, con papas fritas y ensalada.'
  },
  {
    id: 'parr-3',
    name: 'Parrillada Familiar',
    category: 'parrilladas',
    price: 66.00,
    unit: 'Para compartir en familia',
    requiresTaper: true,
    taperCount: 2,
    popular: false,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    description: 'Surtido de carnes a la parrilla, chorizos artesanales, papas y ensalada.'
  },
  {
    id: 'parr-4',
    name: 'Parrillada Triple',
    category: 'parrilladas',
    price: 46.00,
    unit: '3 cortes de carne a elección',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=500&q=80',
    description: 'Tres generosos cortes de carne a la brasa con papas y salsas.'
  },
  {
    id: 'parr-5',
    name: 'Parrillada Mixta',
    category: 'parrilladas',
    price: 35.00,
    unit: 'Plato personal contundente',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    description: 'Pollo y carne a la parrilla acompañados de papas fritas y ensalada.'
  },
  {
    id: 'parr-6',
    name: 'Parrillada de Cordero',
    category: 'parrilladas',
    price: 32.00,
    unit: 'Corte seleccionado de cordero',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Jugoso cordero asado al carbón con hierbas aromáticas.'
  },
  {
    id: 'parr-7',
    name: 'Parrillada de Res',
    category: 'parrilladas',
    price: 28.00,
    unit: 'Filete de res a la parrilla',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80',
    description: 'Carne de res tierna y bien sazonada.'
  },
  {
    id: 'parr-8',
    name: 'Parrillada de Alpaca',
    category: 'parrilladas',
    price: 27.00,
    unit: 'Carne magra tradicional',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80',
    description: 'Carne de alpaca seleccionada, suave, magra y saludable.'
  },
  {
    id: 'parr-9',
    name: 'Parrillada de Chancho',
    category: 'parrilladas',
    price: 27.00,
    unit: 'Chuleta de cerdo a la parrilla',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Corte de cerdo bien dorado al carbón.'
  },
  {
    id: 'parr-10',
    name: 'Parrillada de Pollo',
    category: 'parrilladas',
    price: 27.00,
    unit: 'Pechuga o pierna a la parrilla',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80',
    description: 'Pollo marinado con salsa parrillera de la casa.'
  },
  {
    id: 'parr-11',
    name: 'Anticucho de Corazón',
    category: 'parrilladas',
    price: 23.00,
    unit: 'Palitos de anticucho + Papas',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    description: 'Corazón tierno marinado en ají panca, ajo y vinagre, con papas doradas.'
  },
  {
    id: 'parr-12',
    name: 'Mixto Anticucho con Mollejas',
    category: 'parrilladas',
    price: 25.00,
    unit: 'Anticucho + Mollejas doradas',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    description: 'El clásico sabor del anticucho y mollejas crocantes.'
  },
  {
    id: 'parr-13',
    name: 'Mollejas a la Parrilla',
    category: 'parrilladas',
    price: 15.00,
    unit: 'Porción de mollejas',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    description: 'Mollejitas marinadas y doradas a punto con ají de la casa.'
  },

  // --- PLATOS EXTRAS Y CRIOLLOS ---
  {
    id: 'ext-1',
    name: 'Bisteck a lo Pobre',
    category: 'extras',
    price: 30.00,
    unit: 'Bisteck + Huevos + Plátano + Papas',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Generoso filete de carne con huevos fritos, plátano frito, arroz y papas.'
  },
  {
    id: 'ext-2',
    name: 'Lomo Saltado Criollo',
    category: 'extras',
    price: 23.00,
    unit: 'Lomo al jugo + Papas + Arroz',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Trozos de carne salteados al wok con cebolla, tomate, ají amarillo y sillao.'
  },
  {
    id: 'ext-3',
    name: 'Milanesa de Pollo',
    category: 'extras',
    price: 23.00,
    unit: 'Milanesa crocante + Papas + Arroz',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
    description: 'Filete de pechuga empanizado y dorado, servido con papas fritas y ensalada.'
  },
  {
    id: 'ext-4',
    name: 'Pollo a la Plancha',
    category: 'extras',
    price: 23.00,
    unit: 'Pechuga a la plancha + Guarnición',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
    description: 'Pechuga a la plancha saludable y jugosa.'
  },

  // --- MENÚ DEL DÍA ---
  {
    id: 'men-1',
    name: 'Menú Completo del Día',
    category: 'menu',
    price: 12.00,
    unit: 'Sopa/Entrada + Segundo + Refresco',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'El clásico menú económico de Don José. Incluye entrada/sopa y plato de segundo del día.'
  },
  {
    id: 'men-2',
    name: 'Segundo Solo para Llevar',
    category: 'menu',
    price: 9.00,
    unit: 'Plato de fondo del día',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Porción individual del segundo del día.'
  },

  // --- FINES DE SEMANA ---
  {
    id: 'fin-1',
    name: 'Chicharrón de Chancho (Sáb y Dom)',
    category: 'finde',
    price: 25.00,
    unit: 'Chicharrón + Camote + Mote + Sarza',
    requiresTaper: true,
    taperCount: 1,
    popular: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Crocante chicharrón de cerdo con sarza criolla de cebolla y hierbabuena.'
  },
  {
    id: 'fin-2',
    name: 'Chicharrón de Pollo (Sáb y Dom)',
    category: 'finde',
    price: 28.00,
    unit: 'Chicharrón de pollo dorado',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
    description: 'Trozos crujientes de pollo con papas doradas y cremas.'
  },

  // --- BEBIDAS Y REFRESCOS ---
  {
    id: 'beb-1',
    name: 'Inca Kola 1 Litro',
    category: 'bebidas',
    price: 8.00,
    unit: 'Botella 1 Litro',
    requiresTaper: false,
    taperCount: 0,
    popular: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80',
    description: 'Inca Kola helada para acompañar tus parrilladas y pollos.'
  },
  {
    id: 'beb-2',
    name: 'Inca Kola 2 Litros',
    category: 'bebidas',
    price: 13.00,
    unit: 'Botella Familiar 2L',
    requiresTaper: false,
    taperCount: 0,
    popular: true,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=500&q=80',
    description: 'Formato familiar no retornable bien helada.'
  },
  {
    id: 'beb-3',
    name: 'Inca Kola 1/2 Litro (Personal)',
    category: 'bebidas',
    price: 5.00,
    unit: 'Botella Personal 500ml',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80',
    description: 'Gaseosa personal bien helada.'
  },
  {
    id: 'beb-4',
    name: 'Coca Cola 1/2 Litro (Personal)',
    category: 'bebidas',
    price: 5.00,
    unit: 'Botella Personal 500ml',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80',
    description: 'Coca Cola clásica helada personal.'
  },
  {
    id: 'beb-5',
    name: 'Chicha Morada Casera 1 Litro',
    category: 'bebidas',
    price: 10.00,
    unit: 'Botella / Jarra 1L',
    requiresTaper: false,
    taperCount: 0,
    popular: true,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=500&q=80',
    description: 'Chicha morada natural hervida con maíz morado, piña, manzana y canela.'
  },
  {
    id: 'beb-6',
    name: 'Chicha Morada Casera 1/2 Litro',
    category: 'bebidas',
    price: 6.00,
    unit: 'Botella / Jarra 500ml',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=500&q=80',
    description: 'Chicha natural bien helada en porción personal.'
  },
  {
    id: 'beb-7',
    name: 'Jarra de Vino Especial 1 Litro',
    category: 'bebidas',
    price: 28.00,
    unit: 'Jarra 1L',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80',
    description: 'Vino artesanal de la región para acompañar parrilladas.'
  },
  {
    id: 'beb-8',
    name: 'Cerveza Cristal',
    category: 'bebidas',
    price: 10.00,
    unit: 'Botella 650ml',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=500&q=80',
    description: 'Cerveza clásica bien fría.'
  },
  {
    id: 'beb-9',
    name: 'Cerveza Pilsen Callao',
    category: 'bebidas',
    price: 12.00,
    unit: 'Botella 630ml',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=500&q=80',
    description: 'Cerveza rubia bien helada.'
  },
  {
    id: 'beb-10',
    name: 'Cerveza Cusqueña Trigo / Negra',
    category: 'bebidas',
    price: 12.00,
    unit: 'Botella 620ml',
    requiresTaper: false,
    taperCount: 0,
    popular: false,
    image: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=500&q=80',
    description: 'Cerveza Cusqueña premium a elección.'
  },

  // --- GUARNICIONES ---
  {
    id: 'gua-1',
    name: 'Porción de Arroz Blanco',
    category: 'guarniciones',
    price: 7.00,
    unit: 'Porción en táper',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    description: 'Arroz blanco bien graneado.'
  },
  {
    id: 'gua-2',
    name: 'Porción de Chorizo Artesanal',
    category: 'guarniciones',
    price: 15.00,
    unit: 'Porción parrillera',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    description: 'Chorizos parrilleros bien dorados.'
  },
  {
    id: 'gua-3',
    name: 'Porción de Ensalada Fresca',
    category: 'guarniciones',
    price: 6.00,
    unit: 'Porción con vinagreta',
    requiresTaper: true,
    taperCount: 1,
    popular: false,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80',
    description: 'Ensalada de lechuga, tomate y pepinillo con vinagreta de Don José.'
  }
];
