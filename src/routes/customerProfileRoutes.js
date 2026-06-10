import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/customerAuthController.js'
import { protectCustomer } from '../middleware/auth.js'

// Mounted at /api/customer — the logged-in storefront customer's own profile.
const router = Router()
router.use(protectCustomer)

router.route('/profile').get(getProfile).put(updateProfile)

export default router
