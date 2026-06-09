import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import generateToken from '../utils/generateToken.js'
import User from '../models/User.js'

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required')

  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(409, 'An account with this email already exists')

  const user = await User.create({ name, email, password, role })
  res.status(201).json({ success: true, token: generateToken(user.id), user })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, 'Please provide email and password')

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }

  res.json({ success: true, token: generateToken(user.id), user })
})

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
})
