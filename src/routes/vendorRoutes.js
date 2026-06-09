import { Router } from 'express'
import {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  setVendorStatus,
} from '../controllers/vendorController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.route('/').get(getVendors).post(createVendor)
router.patch('/:id/status', setVendorStatus)
router.route('/:id').get(getVendor).put(updateVendor).delete(deleteVendor)

export default router
