import { Router } from 'express'
import { getStats, getOverview, getReports } from '../controllers/dashboardController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/stats', getStats)
router.get('/overview', getOverview)
router.get('/reports', getReports)

export default router
