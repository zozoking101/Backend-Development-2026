// admin.router.js
import Router from 'express'
import { 
  getAllUsers, 
  getUser,
  checkIfAdmin, 
  banUser, 
  unbanUser, 
  deleteUser, 
  createUser, 
  updateUser, 
  getAllAdmins, 
  promoteToAdmin, 
  demoteToUser, 
  createAndPromoteToAdmin, 
  changeDummyUserPassword
} from '../../controllers/users/admin.controller.js'

const router = Router()

// admin.router.js — admin only user management
router.get('/admins', getAllAdmins)  // Get all admins
router.get('/all', getAllUsers)  // Get all users
router.get('/:id', getUser)  // Get a specific user by id
router.get('/check-admin/:id', checkIfAdmin)  // Check if user is an admin by ID
router.post('/new', createUser)  // Create a dummy user
router.post('/create-and-promote', createAndPromoteToAdmin)  // Create a dummyuser and promote to admin
router.put('/change-dummy-user-password/:id', changeDummyUserPassword)
router.put('/update/:id', updateUser)  // Update user details
router.put('/ban/:id', banUser)  // Ban a user
router.put('/unban/:id', unbanUser)  // Unban a user
router.put('/promote/:id', promoteToAdmin)  // Promote a user to admin
router.put('/demote/:id', demoteToUser)  // Demote an admin to user
router.delete('/delete/:id', deleteUser)  // Delete a user

// router.put('/activate/:id', activateProfile)
// router.put('/deactivate/:id', deactivateProfile)
// router.put('/change-password/:id', changePassword)

export default router