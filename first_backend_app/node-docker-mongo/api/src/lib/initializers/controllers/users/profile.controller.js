// controllers/users/profile.controller.js
import { UserService } from '../../../services/UserService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'profile'
const internalFields = '-password -role -_id -isActive -__v -isBanned -tags'

export const getProfile = (req, res) => {
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

export const updateProfile = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, req.body)
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Successfully updated profile`,
                user
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const deactivateProfile = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, { isActive: false })
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Account deactivated` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const changePassword = (req, res) => {
    const { id } = req.params
    // password hashing + update will go here when auth is implemented
    res.status(200).json({ message: 'Password changed successfully' })
}