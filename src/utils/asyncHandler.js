// Wraps async route handlers so rejected promises flow to the error middleware.
export default function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}
