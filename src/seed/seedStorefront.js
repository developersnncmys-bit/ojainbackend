// Storefront seed — replaces ONLY products + categories with a clean, themed
// Jain/satvik catalogue whose images map to files already in the website's
// /public folder (so cards render on the storefront out of the box).
//
// It deliberately leaves customers, orders, users, etc. untouched so existing
// logins keep working.  Run:  npm run seed:store
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'

const categories = [
  { code: 'CAT-01', name: 'South Indian', slug: 'south-indian', image: '/dosa.jpg', description: 'Crispy dosas, idlis & authentic South Indian classics.', status: 'Active' },
  { code: 'CAT-02', name: 'Paneer Special', slug: 'paneer-special', image: '/paneer.jpg', description: 'Rich, creamy paneer dishes made fresh.', status: 'Active' },
  { code: 'CAT-03', name: 'Biryani', slug: 'biryani', image: '/biryani.jpg', description: 'Aromatic veg biryanis cooked dum-style.', status: 'Active' },
  { code: 'CAT-04', name: 'Pickles', slug: 'pickles', image: '/pickle3.jpg', description: 'Homemade Jain pickles — no onion, no garlic.', status: 'Active' },
  { code: 'CAT-05', name: 'Sweets', slug: 'sweets', image: '/sweet.jpg', description: 'Traditional Indian mithai for every occasion.', status: 'Active' },
  { code: 'CAT-06', name: 'Desserts', slug: 'desserts', image: '/desserts.jpg', description: 'Cool, indulgent desserts & treats.', status: 'Active' },
  { code: 'CAT-07', name: 'Snacks', slug: 'snacks', image: '/snaks.jpg', description: 'Crispy tea-time snacks & quick bites.', status: 'Active' },
  { code: 'CAT-08', name: 'Masala', slug: 'masala', image: '/masala3.jpg', description: 'Freshly ground spice blends & masalas.', status: 'Active' },
]

const V = 'Satvik Foods'
const products = [
  // South Indian
  { code: 'P-2001', name: 'Masala Dosa', category: 'South Indian', price: 120, stock: 200, vendor: V, images: ['/dosa.jpg'], description: 'Crispy golden dosa stuffed with spiced potato masala, served with chutney & sambar.' },
  { code: 'P-2002', name: 'Coconut Rice Bowl', category: 'South Indian', price: 110, stock: 150, vendor: V, images: ['/coconut.jpg'], description: 'Fragrant coconut rice tempered with curry leaves and cashews.' },
  { code: 'P-2003', name: 'Curd Rice (Dahi Bhaat)', category: 'South Indian', price: 99, stock: 180, vendor: V, images: ['/dalrice.jpg'], description: 'Comforting curd rice with a light tadka — perfect for any meal.' },

  // Paneer Special
  { code: 'P-2004', name: 'Shahi Paneer', category: 'Paneer Special', price: 240, stock: 120, vendor: 'Jain Rasoi', images: ['/paneer1.jpg'], description: 'Soft paneer cubes in a rich, creamy tomato-cashew gravy.' },
  { code: 'P-2005', name: 'Paneer Tikka', category: 'Paneer Special', price: 260, stock: 90, vendor: 'Jain Rasoi', images: ['/paneer2.jpg'], description: 'Char-grilled marinated paneer with capsicum & spices.' },
  { code: 'P-2006', name: 'Palak Paneer', category: 'Paneer Special', price: 220, stock: 110, vendor: 'Jain Rasoi', images: ['/paneer.jpg'], description: 'Fresh spinach gravy loaded with homemade paneer.' },

  // Biryani
  { code: 'P-2007', name: 'Veg Dum Biryani', category: 'Biryani', price: 199, stock: 160, vendor: V, images: ['/biryani.jpg'], description: 'Long-grain basmati layered with veggies and aromatic spices.' },
  { code: 'P-2008', name: 'Hyderabadi Biryani', category: 'Biryani', price: 249, stock: 130, vendor: V, images: ['/biryani2.jpg'], description: 'Classic dum-style Hyderabadi veg biryani with raita.' },

  // Pickles
  { code: 'P-2009', name: 'Mango Pickle (Jain)', category: 'Pickles', price: 180, stock: 220, vendor: 'Amba Pickles', images: ['/pickle3.jpg'], description: 'Tangy raw-mango pickle — no onion, no garlic.' },
  { code: 'P-2010', name: 'Mixed Veg Pickle', category: 'Pickles', price: 160, stock: 200, vendor: 'Amba Pickles', images: ['/pickle5.jpg'], description: 'A medley of seasonal vegetables in spicy mustard oil.' },

  // Sweets
  { code: 'P-2011', name: 'Gulab Jamun (6 pcs)', category: 'Sweets', price: 150, stock: 140, vendor: 'Jain Rasoi', images: ['/sweet.jpg'], description: 'Soft khoya dumplings soaked in rose-cardamom syrup.' },
  { code: 'P-2012', name: 'Kaju Katli (250g)', category: 'Sweets', price: 320, stock: 100, vendor: 'Jain Rasoi', images: ['/cake.jpg'], description: 'Melt-in-mouth cashew fudge with a silver-leaf finish.' },

  // Desserts
  { code: 'P-2013', name: 'Rasmalai (4 pcs)', category: 'Desserts', price: 180, stock: 90, vendor: 'Gokul Dairy', images: ['/desserts.jpg'], description: 'Spongy chhena discs in saffron-pistachio milk.' },
  { code: 'P-2014', name: 'Mango Lassi', category: 'Desserts', price: 90, stock: 200, vendor: 'Gokul Dairy', images: ['/mangojuice.jpg'], description: 'Thick, creamy mango yogurt smoothie.' },

  // Snacks
  { code: 'P-2015', name: 'Samosa (2 pcs)', category: 'Snacks', price: 60, stock: 300, vendor: V, images: ['/smosa.jpg'], description: 'Crispy pastry filled with spiced potato & peas.' },
  { code: 'P-2016', name: 'Veg Grilled Sandwich', category: 'Snacks', price: 90, stock: 180, vendor: V, images: ['/Sandwich.jpg'], description: 'Toasted sandwich packed with veggies & chutney.' },

  // Masala
  { code: 'P-2017', name: 'Garam Masala (100g)', category: 'Masala', price: 130, stock: 250, vendor: V, images: ['/masala3.jpg'], description: 'Freshly ground all-purpose garam masala blend.' },
  { code: 'P-2018', name: 'Kitchen King Masala (100g)', category: 'Masala', price: 110, stock: 240, vendor: V, images: ['/masala1.png'], description: 'A versatile masala that lifts every sabzi.' },
]

async function run() {
  await connectDB()
  try {
    await Promise.all([Product.deleteMany(), Category.deleteMany()])
    console.log('✓ Cleared existing products & categories')

    const cats = await Category.insertMany(categories)
    console.log(`✓ Seeded ${cats.length} categories`)

    const prods = await Product.insertMany(products)
    console.log(`✓ Seeded ${prods.length} products`)

    // Keep each category's product count accurate.
    for (const cat of cats) {
      const count = products.filter((p) => p.category === cat.name).length
      await Category.findByIdAndUpdate(cat._id, { products: count })
    }
    console.log('✓ Updated category product counts')
    console.log('\n✓ Storefront catalogue seeded successfully.')
  } catch (err) {
    console.error(`✗ Seed failed: ${err.message}`)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
    process.exit()
  }
}

run()
