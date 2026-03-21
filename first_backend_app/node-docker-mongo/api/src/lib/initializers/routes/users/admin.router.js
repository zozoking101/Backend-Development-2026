import Router from 'express'
import { getAllUsers, getUser, banUser, unbanUser, deleteUser, createUser, updateUser } from '../../controllers/users/admin.controller.js'

const router = Router()

// admin.router.js — admin only user management
router.get('/all', getAllUsers)
router.get('/:id', getUser)
router.post('/new', createUser)
router.put('/update/:id', updateUser)
router.put('/ban/:id', banUser)
router.put('/unban/:id', unbanUser)
router.delete('/delete/:id', deleteUser)

export default router