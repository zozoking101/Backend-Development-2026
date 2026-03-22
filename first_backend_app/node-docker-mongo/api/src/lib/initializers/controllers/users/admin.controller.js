// controllers/users/admin.controller.js
import { UserService } from '../../../services/UserService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'admin'
const internalFields = '-password -role -_id -isActive -__v -isBanned -tags'

export const getAllUsers = (req, res) => {
    UserService.findAll()
        .then(users => res.status(200).json(users))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const getUser = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.findById(id).select(internalFields)
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json(user)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const checkIfAdmin = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.findById(id)  // Get the user by ID
        .then(user => {
            if (!user) {
                return res.status(404).json(new PayloadError(`User with id ${id} not found`, 'id', service).error)
            }

            // Check if the user is an admin
            if (user.role === 'admin') {
                // User is an admin
                return res.status(200).json({
                    message: `User ${user.name.first} ${user.name.last} is an admin`,
                    isAdmin: true
                })
            } else {
                // User is not an admin
                return res.status(200).json({
                    message: `User ${user.name.first} ${user.name.last} is not an admin`,
                    isAdmin: false
                })
            }
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const createUser = (req, res) => {
  UserService.create(req.body)
    .then(user =>
      res.status(201).json({
        message: `Successfully created new user: ${user.name.first} ${user.name.last} 👋🏽`,
        user
      })
    )
    .catch(err => {
      if (err.code === 11000) {
        const key = Object.keys(err.keyPattern)[0] || 'email'
        throw new PayloadError(`User with ${key} ${req.body[key]} already exists`, key, service)
      }

      if (err.name === 'ValidationError') {
        const key = Object.keys(err.errors)
        const messages = Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
      }))
      throw new PayloadError(messages, key, service)
    }
      throw new InternalError(err.message, null, service)
    })
    .catch(err => {
      if (err.error) return res.status(err.statusCode).json(err.error)
    })
}

export const updateUser = (req, res) => {
  const { id } = req.params

   if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

  UserService.update(id, req.body)
    .then(user => {
      if (!user)
        throw new PayloadError(`User with id ${id} not found`, 'id', service)

      res.status(200).json({
        message: `Successfully updated user ${id}`,
        user
      })
    })
    .catch(err =>
      res.status(err.statusCode || 500).json(err.error)
    )
}

export const banUser = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, { isBanned: true, isActive: false })
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `User ${id} has been banned` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const unbanUser = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, { isBanned: false, isActive: true })
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `User ${id} has been unbanned` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const getAllAdmins = (req, res) => {
    UserService.findAll({ role: 'admin' })  // Find all users with role 'admin'
        .then(admins => res.status(200).json(admins))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const promoteToAdmin = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, { role: 'admin' })  // Change user role to 'admin'
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `User ${id} has been promoted to admin` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const demoteToUser = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, { role: 'user' })  // Change user role to 'user'
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `User ${id} has been demoted to user` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const createAndPromoteToAdmin = (req, res) => {
    UserService.create(req.body)
        .then(user => {
            // After creating the user, promote them to admin
            return UserService.update(user._id, { role: 'admin' })
                .then(updatedUser => {
                    res.status(201).json({
                        message: `Successfully created and promoted new user to admin: ${updatedUser.name.first} ${updatedUser.name.last} 👋🏽`,
                        user: updatedUser
                    })
                })
        })
        .catch(err => {
            if (err.code === 11000) {
                const key = Object.keys(err.keyPattern)[0] || 'email'
                throw new PayloadError(`User with ${key} ${req.body[key]} already exists`, key, service)
            }

            if (err.name === 'ValidationError') {
                const key = Object.keys(err.errors)
                const messages = Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }))
                throw new PayloadError(messages, key, service)
            }
            throw new InternalError(err.message, null, service)
        })
        .catch(err => {
            if (err.error) return res.status(err.statusCode).json(err.error)
        })
}

export const changeDummyUserPassword = (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)
    }

    // Fetch the user by ID
    UserService.findByIdWithPassword(id)
        .then(user => {
            if (!user) {
                return res.status(404).json(new PayloadError(`User with id ${id} not found`, 'id', service).error)
            }

            // Compare the current password with the stored password
            if (user.password !== currentPassword) {
                return res.status(400).json(new PayloadError('Incorrect current password', 'currentPassword', service).error)
            }

            // If the current password matches, update with the new password
            UserService.update(id, { password: newPassword })
                .then(updatedUser => {
                    res.status(200).json({ message: 'Password changed successfully' })
                })
                .catch(err => {
                    res.status(err.statusCode || 500).json(err.error)
                })
        })
        .catch(err => {
            res.status(err.statusCode || 500).json(err.error)
        })
}

export const deleteUser = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.delete(id)
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `User ${id} successfully deleted` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}