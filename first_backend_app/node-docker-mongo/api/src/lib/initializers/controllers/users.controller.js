// users.controller.js

import { UserService } from '../../services/UserService.js'

// shared fields
export const internalFields = '-password -role -_id -isActive -__v -isBanned -tags'

// controllers
export const usersPing = (req, res) => {
  res.json({
    message: "users pong"
  })
}

export const createUser = (req, res) => {
  UserService.create(req.body)
    .then(user =>
      res.status(201).json({
        message: `Successfully created new user: ${user.name.first} ${user.name.last} 👋🏽`,
        user
      })
    )
    .catch(err =>
      res.status(500).json({
        message: err.message
      })
    )
}

export const getAllUsers = (req, res) => {
  UserService.findAll()
    .select(internalFields)
    .then(users => res.status(200).json(users))
    .catch(err =>
      res.status(500).json({
        message: err.message
      })
    )
}

export const getUser = (req, res) => {
  const { id } = req.params

  UserService.findById(id)
    .select(internalFields)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: `User with id ${id} not found`
        })
      }

      res.status(200).json(user)
    })
    .catch(err =>
      res.status(500).json({
        message: err.message
      })
    )
}

export const updateUser = (req, res) => {
  const { id } = req.params

  UserService.update(id, req.body)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: `User with id ${id} not found`
        })
      }

      res.status(200).json({
        message: `Successfully updated user ${id}`,
        user
      })
    })
    .catch(err =>
      res.status(500).json({
        message: err.message
      })
    )
}

export const deleteUser = (req, res) => {
  const { id } = req.params

  UserService.delete(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: `User with id ${id} not found`
        })
      }

      res.status(200).json({
        message: `Successfully deleted user ${id}`
      })
    })
    .catch(err =>
      res.status(500).json({
        message: err.message
      })
    )
}