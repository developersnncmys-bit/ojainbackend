import mongoose from 'mongoose'
import { baseOptions } from './schemaOptions.js'

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true }, // e.g. #ORD-7841
    customer: { type: String, required: [true, 'Customer is required'] },
    customerId: { type: String, default: '' }, // links a storefront customer's orders
    date: { type: String }, // display date as in the UI
    items: { type: Number, default: 1, min: 1 }, // line-item count (admin list view)
    lineItems: { type: mongoose.Schema.Types.Mixed, default: [] }, // [{ productId, name, price, qty }]
    address: { type: mongoose.Schema.Types.Mixed, default: null }, // delivery address snapshot
    total: { type: Number, required: true, min: 0 },
    payment: { type: String, enum: ['UPI', 'COD', 'Card'], default: 'UPI' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  baseOptions,
)

export default mongoose.model('Order', orderSchema)
