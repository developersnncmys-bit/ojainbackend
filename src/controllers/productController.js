import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Product from '../models/Product.js'

export const getProducts = factory.getAll(Product, { searchFields: ['name', 'category', 'vendor'] })
export const getProduct = factory.getOne(Product, 'Product')
export const createProduct = factory.createOne(Product)
export const updateProduct = factory.updateOne(Product, 'Product')
export const deleteProduct = factory.deleteOne(Product, 'Product')

// POST /api/products/bulk — insert many products at once (CSV import).
export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const list = Array.isArray(req.body) ? req.body : req.body.products
  if (!Array.isArray(list) || list.length === 0) {
    throw new ApiError(400, 'Provide a non-empty array of products')
  }
  const created = await Product.insertMany(list, { ordered: false })
  res.status(201).json({ success: true, count: created.length, data: created })
})
