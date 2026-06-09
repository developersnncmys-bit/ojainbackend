import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes/index.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))
app.use(express.json({ limit: '10mb' })) // large limit for base64 product images
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Health check
app.get('/', (req, res) => res.json({ name: 'OJAIN Admin API', status: 'ok' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))

// API routes
app.use('/api', routes)

// 404 + central error handler (must be last)
app.use(notFound)
app.use(errorHandler)

export default app
