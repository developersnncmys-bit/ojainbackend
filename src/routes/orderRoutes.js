import { Router } from 'express'
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.route('/').get(getOrders).post(createOrder)
router.patch('/:id/status', updateOrderStatus)
router.route('/:id').get(getOrder).put(updateOrder).delete(deleteOrder)

export default router
