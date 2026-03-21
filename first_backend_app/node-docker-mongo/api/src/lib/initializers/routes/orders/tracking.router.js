import Router from 'express'
import { getOrderTracking, updateOrderStatus, getStatusHistory } from '../../controllers/orders/tracking.controller.js'

const router = Router()

// tracking.router.js — order status and delivery tracking
router.get('/:orderId', getOrderTracking)           // current status
router.put('/status/:orderId', updateOrderStatus)   // update status (admin)
router.get('/history/:orderId', getStatusHistory)   // full status change log

export default router