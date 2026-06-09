// Vercel serverless entry point.
// Ensures the DB is connected (cached) before handing the request to Express.
import app from '../src/app.js'
import connectDB from '../src/config/db.js'

export default async function handler(req, res) {
  try {
    await connectDB()
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({ success: false, message: `Database connection failed: ${err.message}` }),
    )
  }
  return app(req, res)
}
