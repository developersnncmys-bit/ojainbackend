import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Order from '../models/Order.js'

// GET /api/orders
// Admin token  -> paginated list of ALL orders (handlerFactory behaviour).
// Customer token -> only that customer's own orders.
const adminGetAll = factory.getAll(Order, { searchFields: ['code', 'customer'] })
export const getOrders = asyncHandler(async (req, res, next) => {
  if (req.role === 'customer') {
    const orders = await Order.find({ customerId: String(req.user.id) }).sort('-createdAt')
    return res.json({ success: true, count: orders.length, data: orders })
  }
  return adminGetAll(req, res, next)
})

export const getOrder = factory.getOne(Order, 'Order')

// POST /api/orders
// Customers place orders here; the customer identity is taken from the token so
// the client can't spoof someone else's name.
export const createOrder = asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (req.role === 'customer') {
    body.customer = req.user.name
    body.customerId = String(req.user.id)
  }

  // Derive the line-item count when the client sent an array of line items.
  if (Array.isArray(body.lineItems)) body.items = body.lineItems.length || 1

  if (!body.customer) throw new ApiError(400, 'Customer is required')
  if (body.total == null) throw new ApiError(400, 'Order total is required')

  const order = await Order.create(body)

  // Bump the customer's lifetime stats.
  if (req.role === 'customer') {
    const { default: Customer } = await import('../models/Customer.js')
    await Customer.findByIdAndUpdate(req.user.id, {
      $inc: { orders: 1, spent: order.total },
    })
  }

  res.status(201).json({ success: true, data: order })
})

export const updateOrder = factory.updateOne(Order, 'Order')
export const deleteOrder = factory.deleteOne(Order, 'Order')

// PATCH /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  if (!allowed.includes(status)) throw new ApiError(400, `Status must be one of: ${allowed.join(', ')}`)

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!order) throw new ApiError(404, 'Order not found')
  res.json({ success: true, data: order })
})
