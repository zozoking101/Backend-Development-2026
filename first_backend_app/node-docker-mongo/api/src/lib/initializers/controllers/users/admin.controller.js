// controllers/users/admin.controller.js
import { UserService } from '../../../services/UserService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'admin'

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