import { Router } from 'express'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import orderRoutes from './orderRoutes.js'
import customerRoutes from './customerRoutes.js'
import vendorRoutes from './vendorRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import bannerRoutes from './bannerRoutes.js'
import couponRoutes from './couponRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/customers', customerRoutes)
router.use('/vendors', vendorRoutes)
router.use('/reviews', reviewRoutes)
router.use('/banners', bannerRoutes)
router.use('/coupons', couponRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
