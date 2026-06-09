import { Router } from 'express'
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.route('/').get(getReviews).post(createReview)
router.patch('/:id/approve', approveReview)
router.route('/:id').get(getReview).put(updateReview).delete(deleteReview)

export default router
