import { Router } from 'express'
import {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.route('/').get(getCoupons).post(createCoupon)
router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon)

export default router
