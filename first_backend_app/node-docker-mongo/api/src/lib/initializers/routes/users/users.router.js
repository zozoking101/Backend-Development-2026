import { Router } from 'express'
import { usersPing, createUser, getAllUsers, getUser, updateUser, deleteUser } from '../../controllers/users/users.controller.js'
import authRouter from './auth.router.js'
import profileRouter from './profile.router.js'
import adminRouter from './admin.router.js'

const router = Router()

router.get('/ping', usersPing)
router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/admin', adminRouter)
// TODO: delete the following
router.post('/new', createUser)
router.get('/all', getAllUsers)
router.get('/:id', getUser)
router.put('/update/:id', updateUser)
router.delete('/delete/:id', deleteUser)

export default router