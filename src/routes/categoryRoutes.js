import { Router } from 'express'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Public storefront reads
router.get('/', getCategories)
router.get('/:id', getCategory)

// Admin-only writes
router.post('/', protect, createCategory)
router.put('/:id', protect, updateCategory)
router.delete('/:id', protect, deleteCategory)

export default router
