import asyncHandler from './asyncHandler.js'
import ApiError from './ApiError.js'

// Generic, reusable CRUD handlers shared by all resource controllers.
// Each returns an Express handler so controllers stay thin and consistent.

// GET /  — list with pagination, text search and optional status filter.
export const getAll = (Model, { searchFields = [] } = {}) =>
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.search && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: { $regex: req.query.search, $options: 'i' } }))
    }
    if (req.query.status) filter.status = req.query.status

    const [data, total] = await Promise.all([
      Model.find(filter).sort(req.query.sort || '-createdAt').skip(skip).limit(limit),
      Model.countDocuments(filter),
    ])

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      count: data.length,
      data,
    })
  })

// GET /:id
export const getOne = (Model, label = 'Resource') =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id)
    if (!doc) throw new ApiError(404, `${label} not found`)
    res.json({ success: true, data: doc })
  })

// POST /
export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body)
    res.status(201).json({ success: true, data: doc })
  })

// PUT /:id
export const updateOne = (Model, label = 'Resource') =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) throw new ApiError(404, `${label} not found`)
    res.json({ success: true, data: doc })
  })

// DELETE /:id
export const deleteOne = (Model, label = 'Resource') =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) throw new ApiError(404, `${label} not found`)
    res.json({ success: true, message: `${label} deleted` })
  })
