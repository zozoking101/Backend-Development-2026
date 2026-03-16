import { Router } from 'express'
import { usersPing, getUser, createUser, deleteUser } from '../controllers/users.controller.js'


const router = Router()

router.get('/ping', usersPing)
router.get('/:id', getUser)
router.post('/new', createUser)
router.delete('/delete/:id', deleteUser)
export default router