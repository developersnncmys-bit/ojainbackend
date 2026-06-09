import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const reviewSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. R-91
    customer: { type: String, required: true },
    product: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    date: { type: String },
    status: { type: String, enum: ['Published', 'Pending', 'Rejected'], default: 'Pending' },
  },
  baseOptions,
)

export default mongoose.model('Review', reviewSchema)
