import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import generateToken from '../utils/generateToken.js'
import Customer from '../models/Customer.js'

// Strips the password before sending a customer object back to the client.
const sanitize = (customer) => {
  const obj = customer.toJSON()
  delete obj.password
  return obj
}

// POST /api/auth/customer/register  (public)
export const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, city } = req.body
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required')
  }

  const exists = await Customer.findOne({ email })
  if (exists) throw new ApiError(409, 'An account with this email already exists')

  const customer = await Customer.create({ name, email, password, phone, city })
  res.status(201).json({
    success: true,
    token: generateToken(customer.id),
    customer: sanitize(customer),
  })
})

// POST /api/auth/customer/login  (public)
export const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, 'Please provide email and password')

  const customer = await Customer.findOne({ email }).select('+password')
  if (!customer || !(await customer.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }

  res.json({
    success: true,
    token: generateToken(customer.id),
    customer: sanitize(customer),
  })
})

// POST /api/auth/customer/logout  (stateless JWT — client just drops the token)
export const logoutCustomer = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Logged out' })
})

// GET /api/customer/profile  (protected — customer)
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, customer: req.user })
})

// PUT /api/customer/profile  (protected — customer)
export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'city']
  const updates = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }
  // Password change is handled separately so the pre-save hash runs.
  const customer = await Customer.findById(req.user.id)
  Object.assign(customer, updates)
  if (req.body.password) customer.password = req.body.password
  await customer.save()

  res.json({ success: true, customer: sanitize(customer) })
})
