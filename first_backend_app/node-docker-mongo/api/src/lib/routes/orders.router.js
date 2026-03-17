import { Router } from 'express'
import { ordersPing } from '../controllers/orders.controller.js'

const router = Router()

router.get('/ping', ordersPing)

export default router