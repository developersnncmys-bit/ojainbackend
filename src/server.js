import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  const server = app.listen(PORT, () =>
    console.log(`✓ OJAIN API running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`),
  )

  // Graceful shutdown on unhandled errors
  process.on('unhandledRejection', (err) => {
    console.error(`✗ Unhandled rejection: ${err.message}`)
    server.close(() => process.exit(1))
  })
}

start()
