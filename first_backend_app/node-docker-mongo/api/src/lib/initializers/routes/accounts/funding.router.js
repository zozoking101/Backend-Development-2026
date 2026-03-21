import Router from 'express'
import { deposit, withdraw, getBalance } from '../../controllers/accounts/funding.controller.js'

const router = Router()

// funding.router.js — adding and withdrawing money
router.post('/deposit/:accountId', deposit)             // add funds
router.post('/withdraw/:accountId', withdraw)           // withdraw funds
router.get('/balance/:accountId', getBalance)           // current balance

export default router