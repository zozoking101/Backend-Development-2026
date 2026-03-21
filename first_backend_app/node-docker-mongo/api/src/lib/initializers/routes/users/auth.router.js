import { Router } from 'express'
import { register, login, logout, refreshToken, forgotPassword, resetPassword } from '../../controllers/users/users.controller.js'

const router = Router()

// auth.router.js — registration, login, logout, token refresh
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router