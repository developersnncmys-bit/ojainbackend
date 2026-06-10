import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'

export const getProducts = factory.getAll(Product, { searchFields: ['name', 'category', 'vendor'] })
export const getProduct = factory.getOne(Product, 'Product')
export const createProduct = factory.createOne(Product)
export const updateProduct = factory.updateOne(Product, 'Product')
export const deleteProduct = factory.deleteOne(Product, 'Product')

// GET /api/products/category/:categoryId — storefront filter by category.
// `categoryId` may be a Category _id or a category name/slug, since Product.category
// is stored as a string. We resolve an id to its name(s), then match.
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params

  let names = [categoryId]
  if (/^[0-9a-fA-F]{24}$/.test(categoryId)) {
    const cat = await Category.findById(categoryId)
    if (cat) names = [cat.name, cat.slug]
  }

  const products = await Product.find({ category: { $in: names } }).sort('-createdAt')
  res.json({ success: true, count: products.length, data: products })
})

// POST /api/products/bulk — insert many products at once (CSV import).
export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const list = Array.isArray(req.body) ? req.body : req.body.products
  if (!Array.isArray(list) || list.length === 0) {
    throw new ApiError(400, 'Provide a non-empty array of products')
  }
  const created = await Product.insertMany(list, { ordered: false })
  res.status(201).json({ success: true, count: created.length, data: created })
})
