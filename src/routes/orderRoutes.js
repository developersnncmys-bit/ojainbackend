import { Router } from 'express'
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { protect, protectAny } from '../middleware/auth.js'

const router = Router()

// Shared by admin + customer (role decided inside the controller).
router.route('/').get(protectAny, getOrders).post(protectAny, createOrder)

// Admin-only management.
router.patch('/:id/status', protect, updateOrderStatus)
router
  .route('/:id')
  .get(protectAny, getOrder)
  .put(protect, updateOrder)
  .delete(protect, deleteOrder)

export default router
