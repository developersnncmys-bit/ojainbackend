import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
} from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect) // all product routes require authentication

router.route('/').get(getProducts).post(createProduct)
router.post('/bulk', bulkCreateProducts)
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct)

export default router
