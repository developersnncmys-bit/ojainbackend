import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Banner from '../models/Banner.js'

export const getBanners = factory.getAll(Banner, { searchFields: ['title', 'placement'] })
export const getBanner = factory.getOne(Banner, 'Banner')
export const createBanner = factory.createOne(Banner)
export const updateBanner = factory.updateOne(Banner, 'Banner')
export const deleteBanner = factory.deleteOne(Banner, 'Banner')

// PATCH /api/banners/:id/toggle — flip active state.
export const toggleBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)
  if (!banner) throw new ApiError(404, 'Banner not found')
  banner.active = !banner.active
  await banner.save()
  res.json({ success: true, data: banner })
})
