import mongoose from 'mongoose'

// Cache the connection across (warm) serverless invocations so we don't
// open a new connection on every request — and so queries never run
// before a connection exists (which causes "buffering timed out").
let cached = globalThis.__ojainMongoose
if (!cached) cached = globalThis.__ojainMongoose = { conn: null, promise: null }

export default async function connectDB() {
  if (cached.conn) return cached.conn

  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI is not set')

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log(`✓ MongoDB connected: ${m.connection.host}/${m.connection.name}`)
        return m
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null // allow a retry on the next request
    throw err
  }
  return cached.conn
}
