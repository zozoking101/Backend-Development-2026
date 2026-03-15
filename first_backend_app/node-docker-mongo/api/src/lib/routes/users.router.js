import { Router } from 'express'
import { usersPing } from '../controllers/users.controller.js'


const router = Router()

router.get('/ping', usersPing)

export default router