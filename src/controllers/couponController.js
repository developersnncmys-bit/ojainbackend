import * as factory from '../utils/handlerFactory.js'
import Coupon from '../models/Coupon.js'

export const getCoupons = factory.getAll(Coupon, { searchFields: ['code', 'type'] })
export const getCoupon = factory.getOne(Coupon, 'Coupon')
export const createCoupon = factory.createOne(Coupon)
export const updateCoupon = factory.updateOne(Coupon, 'Coupon')
export const deleteCoupon = factory.deleteOne(Coupon, 'Coupon')
