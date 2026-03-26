// controllers/users/profile.controller.js
import { UserService } from '../../../services/UserService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

// export const getAllProfiles = (req, res) => {
//     UserService.findAll()
//         .then(users => res.status(200).json(users))
//         .catch(err =>
//             res.status(500).json(new InternalError(err.message, null, service).error)
//         )
// }

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
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

export const activateProfile = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.update(id, { isActive: true })
        .then(user => {
            if (!user)
                throw new PayloadError(`User with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Account activated` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
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
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

export const changePassword = (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    UserService.findByIdWithPassword(id)
        .then(user => {
            if (!user)
                return res.status(404).json(new PayloadError(`User with id ${id} not found`, 'id', service).error)

            bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
                if (err)
                    return res.status(500).json(new InternalError(err.message, null, service).error)

                if (!isMatch)
                    return res.status(400).json(new PayloadError('Incorrect current password', 'currentPassword', service).error)

                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err)
                        return res.status(500).json(new InternalError(err.message, null, service).error)

                    UserService.update(id, { password: hashedPassword })
                        .then(() => res.status(200).json({ message: 'Password changed successfully' }))
                        .catch(err => res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] }))
                })
            })
        })
        .catch(err => res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] }))
}