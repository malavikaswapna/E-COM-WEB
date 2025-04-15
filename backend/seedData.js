// backend/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Product = require('./models/productModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel');

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample product data
const products = [
  {
    name: 'Ceylon Cinnamon',
    type: 'spice',
    description: 'True Ceylon cinnamon, also known as "true cinnamon," has a delicate, mildly sweet flavor. This variety is lighter in color and has a more complex flavor profile than the more common cassia cinnamon.',
    price: 5.99,
    images: ['https://i.imgur.com/0N3EYfS.jpeg'],
    origin: {
      country: 'Sri Lanka',
      region: 'Matale',
      farm: 'Highland Spice Garden',
      coordinates: {
        latitude: 7.62676,
        longitude: 80.63640
      },
      altitude: '1,200-1,829m',
      cultivationMethod: 'organic'
    },

    // Add producer information
  producerInfo: {
    story: "Our partners at this farm have been growing premium spices for generations, using traditional organic methods that preserve the unique terroir of the region.",
    images: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/79/e6/75/highland-spice-garden.jpg?w=1200&h=-1&s=1",
      "https://cdn.getyourguide.com/img/tour/032c9ae7347c97e12b045a2dd511b337a33e6cc2671cf1e43240afdc6bb80eb3.jpg/146.jpg"
    ],
    sustainablePractices: ['Organic', 'Fair Trade', 'Rainforest Alliance']
  },

    flavorProfile: {
      primary: ['Sweet', 'Warm'],
      notes: ['Floral', 'Citrus', 'Honey'],
      intensity: 3,
      characteristics: ['Sweet', 'Floral', 'Warm', 'Aromatic']
    },
    batchInfo: {
      batchNumber: 'CIN-2023-001',
      productionDate: new Date('2024-01-15'),
      bestBefore: new Date('2025-01-15'),
      shelfLifeDays: 365
    },
    stock: 150,
    unit: 'g',
    categories: ['Baking', 'Sweet Spices', 'Sri Lankan'],
    usageRecommendations: ['Add to desserts', 'Mix in coffee or tea', 'Use in curries'],
    storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
    isActive: true,
    featured: true
  },
  {
    name: 'Darjeeling First Flush',
    type: 'tea',
    description: 'First flush Darjeeling tea from the foothills of the Himalayas. Known as the "champagne of teas," this delicate black tea has a light, floral character with muscatel notes.',
    price: 12.99,
    images: ['https://i.imgur.com/LRZZD12.jpeg'],
    origin: {
      country: 'India',
      region: 'Darjeeling, West Bengal',
      farm: 'Makaibari Tea Estate',
      coordinates: {
        latitude: 27.0595,
        longitude: 88.2639
      },
      altitude: '1,200-1,800m',
      cultivationMethod: 'organic'
    },

    // Add producer information
  producerInfo: {
    story: "Our partners at this farm have been growing premium spices for generations, using traditional organic methods that preserve the unique terroir of the region.",
    images: [
      "https://assets.bbhub.io/media/sites/14/2015/08/Tea03.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a7/ac/b9/caption.jpg?w=1200&h=-1&s=1"
    ],
    sustainablePractices: ['Organic', 'Fair Trade', 'Rainforest Alliance']
  },

    flavorProfile: {
      primary: ['Floral', 'Muscatel'],
      notes: ['Grape', 'Citrus', 'Honey'],
      intensity: 2,
      characteristics: ['Floral', 'Fruity', 'Light', 'Aromatic']
    },
    batchInfo: {
      batchNumber: 'DAR-2024-001',
      productionDate: new Date('2024-03-10'),
      bestBefore: new Date('2024-09-10'),
      shelfLifeDays: 180
    },
    stock: 80,
    unit: 'g',
    categories: ['Black Tea', 'Indian Tea', 'Premium'],
    usageRecommendations: ['Brew for 2-3 minutes', 'Serve without milk', 'Best in the afternoon'],
    storageInstructions: 'Store in an airtight container away from moisture, heat, and strong odors.',
    isActive: true,
    featured: true
  },
  {
    name: 'Smoked Paprika',
    type: 'spice',
    description: 'This Spanish smoked paprika (Pimentón de la Vera) is made from peppers that are slowly dried over oak fires, giving it a distinctive smoky flavor that adds depth to any dish.',
    price: 4.99,
    images: ['https://i.imgur.com/jG0xCW3.jpeg'],
    origin: {
      country: 'Spain',
      region: 'Extremadura',
      farm: 'Finca La Barca',
      coordinates: {
        latitude: 40.000979,
        longitude: -6.09983
      },
      altitude: '1,200-1,800m',
      cultivationMethod: 'conventional'
    },

    // Add producer information
    producerInfo: {
      story: "Our partners at this farm have been growing premium spices for generations, using traditional organic methods that preserve the unique terroir of the region.",
      images: [
        "https://valenciafruits.com/wp-content/uploads/2023/08/3.jpeg",
        "https://estaticos-cdn.prensaiberica.es/clip/bdcf76e1-cda7-45fd-8c21-5cdeb86891cb_source-aspect-ratio_default_0_x376y1298.jpg"
      ],
    sustainablePractices: ['Organic', 'Fair Trade', 'Rainforest Alliance']
  },
    flavorProfile: {
      primary: ['Smoky', 'Sweet'],
      notes: ['Oak', 'Pepper', 'Earthy'],
      intensity: 4,
      characteristics: ['Smoky', 'Earthy', 'Sweet', 'Warm']
    },
    batchInfo: {
      batchNumber: 'PAP-2023-005',
      productionDate: new Date('2023-11-20'),
      bestBefore: new Date('2024-11-20'),
      shelfLifeDays: 365
    },
    stock: 95,
    unit: 'g',
    categories: ['Spanish', 'Smoke-Dried', 'Pepper'],
    usageRecommendations: ['Add to stews', 'Mix in marinades', 'Sprinkle on roasted vegetables'],
    storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
    isActive: true,
    featured: false
  },
  {
    name: 'Jasmine Dragon Pearl',
    type: 'tea',
    description: 'Hand-rolled pearls of green tea scented with jasmine blossoms. When steeped, these pearls unfurl to release a sweet, floral aroma and smooth flavor.',
    price: 14.99,
    images: ['https://i.imgur.com/jOSyFu6.jpeg'],
    origin: {
      country: 'China',
      region: 'Fujian Province',
      farm: 'Highland Spice Garden',
      coordinates: {
        latitude: 26.0789,
        longitude: 119.2987
      },
      altitude: '800-1,200m',
      cultivationMethod: 'conventional'
    },
    flavorProfile: {
      primary: ['Jasmine', 'Floral'],
      notes: ['Sweet', 'Delicate', 'Green'],
      intensity: 3,
      characteristics: ['Floral', 'Sweet', 'Aromatic', 'Smooth']
    },
    batchInfo: {
      batchNumber: 'JDP-2024-002',
      productionDate: new Date('2024-02-15'),
      bestBefore: new Date('2024-08-15'),
      shelfLifeDays: 180
    },
    stock: 65,
    unit: 'g',
    categories: ['Green Tea', 'Chinese Tea', 'Scented Tea'],
    usageRecommendations: ['Brew at 80°C for 2-3 minutes', 'Can be steeped multiple times', 'Best enjoyed in the morning or afternoon'],
    storageInstructions: 'Store in an airtight container away from moisture, heat, light, and strong odors.',
    isActive: true,
    featured: true
  },
  {
    name: 'Cardamom Pods',
    type: 'spice',
    description: 'Whole green cardamom pods with a complex, aromatic flavor that\'s both sweet and spicy with hints of citrus. A staple in Indian, Middle Eastern, and Scandinavian cooking.',
    price: 7.99,
    images: ['https://i.imgur.com/NxfX2eW.jpeg'],
    origin: {
      country: 'India',
      region: 'Kerala',
      farm: 'Njallaniyil Cardamom Plantations',
      coordinates: {
        latitude: 9.76145,
        longitude: 77.13805
      },
      altitude: '600-1,500m',
      cultivationMethod: 'organic'
    },

    // Add producer information
    producerInfo: {
      story: "Our partners at this farm have been growing premium spices for generations, using traditional organic methods that preserve the unique terroir of the region.",
      images: [
        "https://wideangleadventure.com/wp-content/uploads/2015/04/Cardamom-Plantation-Munnar-2-of-6.jpg",
        "https://www.thekodaichronicle.com/wp-content/uploads/2024/07/Cardamom-plant-Shabin-Shajan.jpg"
      ],
      sustainablePractices: ['Organic', 'Fair Trade', 'Rainforest Alliance']
  },

    flavorProfile: {
      primary: ['Aromatic', 'Sweet'],
      notes: ['Citrus', 'Eucalyptus', 'Mint'],
      intensity: 4,
      characteristics: ['Aromatic', 'Sweet', 'Spicy', 'Citrusy']
    },
    batchInfo: {
      batchNumber: 'CAR-2023-009',
      productionDate: new Date('2023-09-05'),
      bestBefore: new Date('2024-09-05'),
      shelfLifeDays: 365
    },
    stock: 120,
    unit: 'g',
    categories: ['Indian', 'Aromatic', 'Pods'],
    usageRecommendations: ['Add to rice dishes', 'Use in chai tea', 'Incorporate into baked goods'],
    storageInstructions: 'Store in a cool, dry place in an airtight container.',
    isActive: true,
    featured: false
  },
  {
    name: 'Summer Chai Blend',
    type: 'blend',
    description: 'A refreshing twist on traditional chai, this blend combines black tea with cooling spices like cardamom, lemongrass, and a hint of mint, perfect for iced tea on hot summer days.',
    price: 9.99,
    images: ['https://i.imgur.com/tCAiT75.jpeg'],
    origin: {
      country: 'Multiple',
      region: 'Blend',
      farm: 'Main Blending House',
      coordinates: {             
        latitude: 12.9716,
        longitude: 77.5946
      },
      cultivationMethod: 'conventional',
      // Add blender information
      producerInfo: {
        story: "Our master blenders carefully craft each blend using premium ingredients selected from around the world. Each component is chosen for its unique qualities and how it contributes to the overall profile.",
        images: [
          "https://images.unsplash.com/photo-1517128317859-541a299307cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80",
          "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80"
        ],
        sustainablePractices: ['Fair Trade', 'Small Batch', 'Recyclable Packaging']
      },
      components: [
        { name: 'Black Tea', country: 'India', region: 'Assam' },
        { name: 'Cardamom', country: 'India', region: 'Kerala' },
        { name: 'Lemongrass', country: 'India', region: 'Kerala' },
        { name: 'Mint', country: 'Morocco', region: 'Meknes' }
      ],
    },
    flavorProfile: {
      primary: ['Spicy', 'Refreshing'],
      notes: ['Cardamom', 'Mint', 'Citrus'],
      intensity: 3,
      characteristics: ['Spicy', 'Refreshing', 'Aromatic', 'Cool']
    },
    batchInfo: {
      batchNumber: 'SCB-2024-001',
      productionDate: new Date('2024-04-01'),
      bestBefore: new Date('2024-10-01'),
      shelfLifeDays: 180
    },
    stock: 50,
    unit: 'g',
    categories: ['Tea Blend', 'Chai', 'Summer', 'Seasonal'],
    usageRecommendations: ['Steep for 4-5 minutes', 'Serve iced with milk and honey', 'Makes excellent cold brew'],
    storageInstructions: 'Store in an airtight container in a cool, dry place.',
    isActive: true,
    featured: true
  }
];

// Sample user data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 12),
    role: 'admin',
    flavorPreferences: {
      likedFlavors: ['Sweet', 'Spicy', 'Aromatic'],
      dislikedFlavors: ['Bitter'],
      preferredIntensity: 4
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 12),
    role: 'user',
    flavorPreferences: {
      likedFlavors: ['Sweet', 'Floral'],
      dislikedFlavors: ['Smoky', 'Bitter'],
      preferredIntensity: 2
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 12),
    role: 'user',
    flavorPreferences: {
      likedFlavors: ['Spicy', 'Earthy', 'Smoky'],
      dislikedFlavors: ['Floral'],
      preferredIntensity: 4
    }
  }
];

// Sample order data (to be created after users and products are inserted)
const createOrders = async (usersFromDB, productsFromDB) => {
  // Find user IDs
  const johnUser = usersFromDB.find(user => user.email === 'john@example.com');
  const janeUser = usersFromDB.find(user => user.email === 'jane@example.com');
  
  // Find product IDs
  const cinnamon = productsFromDB.find(product => product.name === 'Ceylon Cinnamon');
  const darjeeling = productsFromDB.find(product => product.name === 'Darjeeling First Flush');
  const paprika = productsFromDB.find(product => product.name === 'Smoked Paprika');
  const jasmine = productsFromDB.find(product => product.name === 'Jasmine Dragon Pearl');
  const cardamom = productsFromDB.find(product => product.name === 'Cardamom Pods');
  
  const orders = [
    {
      user: johnUser._id,
      orderItems: [
        {
          name: cinnamon.name,
          qty: 2,
          image: cinnamon.images[0],
          price: cinnamon.price,
          unit: cinnamon.unit,
          product: cinnamon._id
        },
        {
          name: darjeeling.name,
          qty: 1,
          image: darjeeling.images[0],
          price: darjeeling.price,
          unit: darjeeling.unit,
          product: darjeeling._id
        }
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'Boston',
        postalCode: '02108',
        country: 'USA'
      },
      paymentMethod: 'Stripe',
      itemsPrice: (cinnamon.price * 2) + darjeeling.price,
      taxPrice: ((cinnamon.price * 2) + darjeeling.price) * 0.15,
      shippingPrice: 10,
      totalPrice: ((cinnamon.price * 2) + darjeeling.price) * 1.15 + 10,
      isPaid: true,
      paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isDelivered: false,
      inventoryUpdated: true
    },
    {
      user: janeUser._id,
      orderItems: [
        {
          name: paprika.name,
          qty: 1,
          image: paprika.images[0],
          price: paprika.price,
          unit: paprika.unit,
          product: paprika._id
        },
        {
          name: cardamom.name,
          qty: 3,
          image: cardamom.images[0],
          price: cardamom.price,
          unit: cardamom.unit,
          product: cardamom._id
        },
        {
          name: jasmine.name,
          qty: 2,
          image: jasmine.images[0],
          price: jasmine.price,
          unit: jasmine.unit,
          product: jasmine._id
        }
      ],
      shippingAddress: {
        address: '456 Elm St',
        city: 'San Francisco',
        postalCode: '94107',
        country: 'USA'
      },
      paymentMethod: 'PayPal',
      itemsPrice: paprika.price + (cardamom.price * 3) + (jasmine.price * 2),
      taxPrice: (paprika.price + (cardamom.price * 3) + (jasmine.price * 2)) * 0.15,
      shippingPrice: 0, // Free shipping because order is over $100
      totalPrice: (paprika.price + (cardamom.price * 3) + (jasmine.price * 2)) * 1.15,
      isPaid: true,
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      inventoryUpdated: true
    },
    {
      user: johnUser._id,
      orderItems: [
        {
          name: jasmine.name,
          qty: 1,
          image: jasmine.images[0],
          price: jasmine.price,
          unit: jasmine.unit,
          product: jasmine._id
        }
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'Boston',
        postalCode: '02108',
        country: 'USA'
      },
      paymentMethod: 'Stripe',
      itemsPrice: jasmine.price,
      taxPrice: jasmine.price * 0.15,
      shippingPrice: 10,
      totalPrice: jasmine.price * 1.15 + 10,
      isPaid: false,
      isDelivered: false,
      inventoryUpdated: false
    }
  ];
  
  return orders;
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    
    console.log('Database cleared');
    
    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Create and insert orders
    const orderData = await createOrders(createdUsers, createdProducts);
    const createdOrders = await Order.insertMany(orderData);
    console.log(`${createdOrders.length} orders created`);
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();