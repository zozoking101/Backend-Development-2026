import { UserService } from '../../services/UserService.js'
import { PayloadError, InternalError } from '../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'user'
export const internalFields = '-password -role -_id -isActive -__v -isBanned -tags'

// custom error structure
// const errorJSON = {
//   "error": {
//       "type": "internal/payload",
//       "timestamp": "2021-05-26T12:20:25.000Z",
//       "code": 500,
//       "messages": [
//         "Internal server error"
//       ],
//       "key": "email",
//       "service": "user",
//   }
// }

export const usersPing = (req, res) => {
  res.json({ message: "users pong" })
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

  UserService.findById(id)
    .then(user => {
      if (!user)
        throw new PayloadError(`User with id ${id} not found`, 'id', service)

      res.status(200).json(user)
    })
    .catch(err =>
      res.status(err.statusCode || 500).json(err.error)
    )
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

export const deleteUser = (req, res) => {
  const { id } = req.params

   if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

  UserService.delete(id)
    .then(user => {
      if (!user)
        throw new PayloadError(`User with id ${id} not found`, 'id', service)

      res.status(200).json({
        message: `Successfully deleted user ${id}`
      })
    })
    .catch(err =>
      res.status(err.statusCode || 500).json(err.error)
    )
}