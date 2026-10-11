import 'dotenv/config'
import app from './app'
import { connectDB } from './config/db'
import { logger } from './config/logger'

const PORT = parseInt(process.env.PORT || '5000', 10)

async function start(): Promise<void> {
  try {
    await connectDB()
    app.listen(PORT, () => {
      logger.info(`🚀 Papikondalu API running on http://localhost:${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (err) {
    logger.error('Failed to start server', { err })
    process.exit(1)
  }
}

start()
