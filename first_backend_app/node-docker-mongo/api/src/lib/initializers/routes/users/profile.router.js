import Router from 'express'
import { getProfile, updateProfile, activateProfile, deactivateProfile, changePassword } from '../../controllers/users/profile.controller.js'

const router = Router()

// profile.router.js — authenticated user managing their own data
// router.get('/all', getAllProfiles)
router.get('/:id', getProfile)
router.put('/update/:id', updateProfile)
router.put('/activate/:id', activateProfile)
router.put('/deactivate/:id', deactivateProfile)
router.put('/change-password/:id', changePassword)

export default router