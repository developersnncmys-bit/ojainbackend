import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  getProductsByCategory,
} from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Public storefront reads
router.get('/', getProducts)
router.get('/category/:categoryId', getProductsByCategory)

// Admin-only writes
router.post('/', protect, createProduct)
router.post('/bulk', protect, bulkCreateProducts)

// Keep the param route last so it doesn't swallow '/category' or '/bulk'
router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct)

export default router
