import { Router } from 'express'
import { usersPing } from '../../controllers/users/users.controller.js'
import authRouter from './auth.router.js'
import profileRouter from './profile.router.js'
import adminRouter from './admin.router.js'

const router = Router()

router.get('/ping', usersPing)
router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/admin', adminRouter)

export default router