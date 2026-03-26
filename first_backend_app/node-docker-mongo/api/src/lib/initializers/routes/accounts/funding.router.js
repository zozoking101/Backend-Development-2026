import Router from 'express'
import { deposit, withdraw, getBalance } from '../../controllers/accounts/funding.controller.js'

const router = Router()

// funding.router.js — adding and withdrawing money
router.post('/deposit/:userId', deposit)             // add funds
router.post('/withdraw/:userId', withdraw)           // withdraw funds
router.get('/balance/:userId', getBalance)           // current balance

export default router