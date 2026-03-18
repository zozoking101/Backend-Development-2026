import { Router } from 'express'
import { usersPing, createUser, getAllUsers, getUser, updateUser, deleteUser } from '../controllers/users.controller.js'

const router = Router()

router.get('/ping', usersPing)
router.post('/new', createUser)
router.get('/all', getAllUsers)
router.get('/:id', getUser)
router.put('/update/:id', updateUser)
router.delete('/delete/:id', deleteUser)

export default router