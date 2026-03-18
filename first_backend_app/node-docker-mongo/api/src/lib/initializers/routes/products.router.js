import { Router } from 'express'
import { productsPing } from '../controllers/products.controller.js'

const router = Router()

router.get('/ping', productsPing)

export default router