import ApiError from '../utils/ApiError.js'

// Catches requests to unknown routes.
export default function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}
