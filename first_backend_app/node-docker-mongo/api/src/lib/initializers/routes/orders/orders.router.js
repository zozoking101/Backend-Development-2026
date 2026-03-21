import { Router } from 'express'
import trackingRouter from './tracking.router.js'
import returnsRouter from './returns.router.js'
import { ordersPing, createOrder, getAllOrders, getOrder, updateOrder, deleteOrder } from '../../controllers/orders/orders.controller.js'

const router = Router()

router.use('/tracking', trackingRouter)
router.use('/returns', returnsRouter)

router.get('/ping', ordersPing)
router.post('/new', createOrder)
router.get('/all', getAllOrders)
router.get('/:id', getOrder)
router.put('/update/:id', updateOrder)
router.delete('/delete/:id', deleteOrder)

export default router