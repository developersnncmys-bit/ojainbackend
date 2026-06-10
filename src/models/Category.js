import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const categorySchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. CAT-01
    name: { type: String, required: [true, 'Category name is required'], trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    image: { type: String, default: '' }, // URL or base64 — shown on the storefront
    description: { type: String, default: '' },
    products: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  baseOptions,
)

// Auto-generate slug from name when missing.
categorySchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }
  next()
})

export default mongoose.model('Category', categorySchema)
