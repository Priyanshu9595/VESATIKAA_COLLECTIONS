import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fashion-boutique';

const initialProducts = [
  {
    name: 'Silk Evening Gown',
    price: 450,
    category: 'Evening Wear',
    collectionName: 'Summer 26',
    description: 'A luxurious silk evening gown with a flowing silhouette, perfect for formal events.',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    countInStock: 10,
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Red', 'Emerald']
  },
  {
    name: 'Tailored Linen Suit',
    price: 320,
    category: 'Suits',
    collectionName: 'Summer 26',
    description: 'A breathable and stylish linen suit designed for warm weather elegance.',
    images: [
      'https://images.unsplash.com/photo-1594938298596-1c2ce38b813b?auto=format&fit=crop&q=80&w=800'
    ],
    countInStock: 15,
    sizes: ['M', 'L', 'XL'],
    colors: ['Beige', 'Navy']
  },
  {
    name: 'Velvet Mini Dress',
    price: 210,
    category: 'Dresses',
    collectionName: 'Winter 25',
    description: 'A bold velvet mini dress with subtle shimmer, ideal for night outs.',
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800'
    ],
    countInStock: 5,
    sizes: ['XS', 'S', 'M'],
    colors: ['Burgundy', 'Black']
  },
  {
    name: 'Leather Trench Coat',
    price: 550,
    category: 'Outerwear',
    collectionName: 'Winter 25',
    description: 'A premium leather trench coat, combining classic design with a modern edge.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
    ],
    countInStock: 8,
    sizes: ['M', 'L'],
    colors: ['Black', 'Brown']
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding database...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');
    
    await Product.insertMany(initialProducts);
    console.log('Database seeded with initial products.');
    
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
