import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
} from '../controllers/customerAuthController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Admin / staff auth (User model)
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)

// Storefront customer auth (Customer model)
router.post('/customer/register', registerCustomer)
router.post('/customer/login', loginCustomer)
router.post('/customer/logout', logoutCustomer)

export default router
