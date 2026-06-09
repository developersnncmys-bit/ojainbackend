import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const vendorSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. V-21
    name: { type: String, required: [true, 'Vendor name is required'], trim: true },
    owner: { type: String, default: '' },
    products: { type: Number, default: 0, min: 0 },
    sales: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  },
  baseOptions,
)

export default mongoose.model('Vendor', vendorSchema)
