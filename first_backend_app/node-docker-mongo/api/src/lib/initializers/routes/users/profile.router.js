import Router from 'express'
import { getProfile, updateProfile, deactivateProfile, changePassword } from '../../controllers/users/users.controller.js'

const router = Router()

// profile.router.js — authenticated user managing their own data
router.get('/', getProfile)
router.put('/update', updateProfile)
router.delete('/deactivate', deactivateProfile)
router.put('/change-password', changePassword)

export default router