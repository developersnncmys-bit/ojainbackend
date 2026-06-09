import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as factory from '../utils/handlerFactory.js'
import Vendor from '../models/Vendor.js'

export const getVendors = factory.getAll(Vendor, { searchFields: ['name', 'owner'] })
export const getVendor = factory.getOne(Vendor, 'Vendor')
export const createVendor = factory.createOne(Vendor)
export const updateVendor = factory.updateOne(Vendor, 'Vendor')
export const deleteVendor = factory.deleteOne(Vendor, 'Vendor')

// PATCH /api/vendors/:id/status  { status: 'Approved' | 'Rejected' | 'Pending' }
export const setVendorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const allowed = ['Approved', 'Rejected', 'Pending']
  if (!allowed.includes(status)) throw new ApiError(400, `Status must be one of: ${allowed.join(', ')}`)

  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!vendor) throw new ApiError(404, 'Vendor not found')
  res.json({ success: true, data: vendor })
})
