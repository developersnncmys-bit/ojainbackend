import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Order from '../models/Order.js'

export const getOrders = factory.getAll(Order, { searchFields: ['code', 'customer'] })
export const getOrder = factory.getOne(Order, 'Order')
export const createOrder = factory.createOne(Order)
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
