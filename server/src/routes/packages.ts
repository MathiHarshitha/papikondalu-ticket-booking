import { Router } from 'express'
import * as ctrl from '../controllers/packagesController'
import { authenticate, requireAdmin } from '../middleware/auth'

const router = Router()

router.get('/', ctrl.listPackages)
router.get('/:slug', ctrl.getPackage)

router.post('/', authenticate, requireAdmin, ctrl.createPackage)
router.put('/:id', authenticate, requireAdmin, ctrl.updatePackage)
router.delete('/:id', authenticate, requireAdmin, ctrl.deletePackage)

export default router
