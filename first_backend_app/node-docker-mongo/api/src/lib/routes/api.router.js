import { Router } from 'express'
import { apiPing } from '../controllers/api.controller.js'

const router = Router()

router.get('/ping', apiPing)

export default router