import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const customerSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. C-501
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, default: '' },
    orders: { type: Number, default: 0, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Active', 'Inactive', 'VIP'], default: 'Active' },
  },
  baseOptions,
)

export default mongoose.model('Customer', customerSchema)
