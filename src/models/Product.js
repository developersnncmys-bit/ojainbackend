import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const productSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. P-1001
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, default: '' }, // shown on the storefront
    category: { type: String, required: true },
    isVeg: { type: Boolean, default: true }, // Jain/satvik — veg badge on the storefront
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    vendor: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Low Stock', 'Out of Stock', 'Inactive'],
      default: 'Active',
    },
    images: { type: [String], default: [] }, // URLs or base64 data URLs
  },
  baseOptions,
)

// Keep status consistent with stock.
productSchema.pre('save', function syncStatus(next) {
  if (this.stock === 0) this.status = 'Out of Stock'
  next()
})

export default mongoose.model('Product', productSchema)
