import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { baseOptions } from './schemaOptions.js'

const customerSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. C-501
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: { unique: true, sparse: true },
    },
    // Storefront login password. Optional so admin-seeded customers (without a
    // password) stay valid; required in practice for self-registered customers.
    password: { type: String, minlength: 6, select: false },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    orders: { type: Number, default: 0, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Active', 'Inactive', 'VIP'], default: 'Active' },
  },
  baseOptions,
)

// Hash password whenever it is set/changed.
customerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

customerSchema.methods.matchPassword = function matchPassword(candidate) {
  if (!this.password) return Promise.resolve(false)
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('Customer', customerSchema)
