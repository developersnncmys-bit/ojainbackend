// Central error handler — normalises Mongoose & JWT errors into clean JSON.
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Invalid Mongo ObjectId
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0]
    message = `Duplicate value for "${field}" — it already exists`
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
