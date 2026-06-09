import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'

import User from '../models/User.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import Vendor from '../models/Vendor.js'
import Review from '../models/Review.js'
import Banner from '../models/Banner.js'
import Coupon from '../models/Coupon.js'

import * as data from './data.js'

const collections = [
  [Product, data.products],
  [Category, data.categories],
  [Order, data.orders],
  [Customer, data.customers],
  [Vendor, data.vendors],
  [Review, data.reviews],
  [Banner, data.banners],
  [Coupon, data.coupons],
]

async function destroy() {
  await Promise.all([...collections.map(([Model]) => Model.deleteMany()), User.deleteMany()])
  console.log('✓ All collections cleared')
}

async function importData() {
  await destroy()

  // Default admin
  await User.create({
    name: process.env.ADMIN_NAME || 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@ojain.in',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'Super Admin',
  })
  console.log(`✓ Admin created: ${process.env.ADMIN_EMAIL || 'admin@ojain.in'}`)

  for (const [Model, docs] of collections) {
    await Model.insertMany(docs)
    console.log(`✓ Seeded ${docs.length} ${Model.modelName}(s)`)
  }
}

async function run() {
  await connectDB()
  try {
    if (process.argv.includes('--destroy')) {
      await destroy()
    } else {
      await importData()
      console.log('\n✓ Database seeded successfully.')
    }
  } catch (err) {
    console.error(`✗ Seed failed: ${err.message}`)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
    process.exit()
  }
}

run()
