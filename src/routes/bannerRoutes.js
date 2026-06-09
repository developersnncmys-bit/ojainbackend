import { Router } from 'express'
import {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} from '../controllers/bannerController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.route('/').get(getBanners).post(createBanner)
router.patch('/:id/toggle', toggleBanner)
router.route('/:id').get(getBanner).put(updateBanner).delete(deleteBanner)

export default router
