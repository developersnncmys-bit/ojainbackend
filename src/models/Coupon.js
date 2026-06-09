import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, 'Coupon code is required'], unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['Percent', 'Flat', 'Shipping'], default: 'Percent' },
    value: { type: String, required: true }, // e.g. "20%", "₹50", "Free"
    minOrder: { type: Number, default: 0, min: 0 },
    uses: { type: Number, default: 0, min: 0 },
    expiry: { type: String },
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
  },
  baseOptions,
)

export default mongoose.model('Coupon', couponSchema)
