import Router from 'express'
import { requestReturn, getAllReturns, approveReturn, rejectReturn, processRefund } from '../../controllers/orders/returns.controller.js'

const router = Router()

// returns.router.js — returns and refunds
router.post('/request/:orderId', requestReturn)     // user requests return
router.get('/all', getAllReturns)                   // admin sees all returns
router.put('/approve/:id', approveReturn)           // admin approves
router.put('/reject/:id', rejectReturn)             // admin rejects
router.put('/refund/:id', processRefund)           // trigger refund to account

export default router