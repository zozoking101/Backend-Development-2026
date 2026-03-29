import Router from 'express'
import { getTransactions, getTransaction, filterTransactions } from '../../controllers/accounts/transactions.controller.js'

const router = Router()

// transactions.router.js — transaction history and lookup
router.get('/all/:accountId', getTransactions)          // full history
router.get('/:id', getTransaction)                      // single transaction
router.get('/filter/:accountId', filterTransactions)    // by type/date range

export default router