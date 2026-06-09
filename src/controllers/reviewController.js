import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Review from '../models/Review.js'

export const getReviews = factory.getAll(Review, { searchFields: ['customer', 'product', 'comment'] })
export const getReview = factory.getOne(Review, 'Review')
export const createReview = factory.createOne(Review)
export const updateReview = factory.updateOne(Review, 'Review')
export const deleteReview = factory.deleteOne(Review, 'Review')

// PATCH /api/reviews/:id/approve
export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: 'Published' }, { new: true })
  if (!review) throw new ApiError(404, 'Review not found')
  res.json({ success: true, data: review })
})
