import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const bannerSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. B-1
    title: { type: String, required: [true, 'Banner title is required'], trim: true },
    placement: {
      type: String,
      enum: ['Home Hero', 'Category Top', 'Sidebar', 'Checkout'],
      default: 'Home Hero',
    },
    active: { type: Boolean, default: true },
    clicks: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
  },
  baseOptions,
)

export default mongoose.model('Banner', bannerSchema)
