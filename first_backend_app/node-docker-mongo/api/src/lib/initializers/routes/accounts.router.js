import { Router } from 'express'
import { accountsPing } from '../controllers/accounts.controller.js'

const router = Router()

router.get('/ping', accountsPing)

export default router