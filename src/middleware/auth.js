import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import User from '../models/User.js'
import Customer from '../models/Customer.js'

// Reads + verifies the Bearer JWT, returning the decoded payload (or throws).
const decodeToken = (req) => {
  let token
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1]
  if (!token) throw new ApiError(401, 'Not authorized — no token provided')

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new ApiError(401, 'Not authorized — invalid or expired token')
  }
}

// Admin/staff guard — token must resolve to a User. Attaches req.user, req.role.
export const protect = asyncHandler(async (req, res, next) => {
  const decoded = decodeToken(req)
  const user = await User.findById(decoded.id)
  if (!user) throw new ApiError(401, 'The user for this token no longer exists')

  req.user = user
  req.role = 'admin'
  next()
})

// Storefront guard — token must resolve to a Customer. Attaches req.user, req.role.
export const protectCustomer = asyncHandler(async (req, res, next) => {
  const decoded = decodeToken(req)
  const customer = await Customer.findById(decoded.id)
  if (!customer) throw new ApiError(401, 'The customer for this token no longer exists')

  req.user = customer
  req.role = 'customer'
  next()
})

// Accepts either an admin User or a storefront Customer token. Used on routes
// shared by both audiences (e.g. orders). Sets req.role to 'admin'|'customer'.
export const protectAny = asyncHandler(async (req, res, next) => {
  const decoded = decodeToken(req)

  const user = await User.findById(decoded.id)
  if (user) {
    req.user = user
    req.role = 'admin'
    return next()
  }

  const customer = await Customer.findById(decoded.id)
  if (customer) {
    req.user = customer
    req.role = 'customer'
    return next()
  }

  throw new ApiError(401, 'The account for this token no longer exists')
})

// Restricts a route to specific roles, e.g. restrictTo('Super Admin').
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'))
  }
  next()
}
