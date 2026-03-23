// controllers/accounts/accounts.controller.js
import { AccountService } from '../../../services/AccountService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'accounts'

export const accountsPing = (req, res) => res.json({ message: 'accounts pong' })

export const createAccount = (req, res) => {
    AccountService.create(req.body)
        .then(account =>
            res.status(201).json({
                message: `Account created successfully`,
                account
            })
        )
        .catch(err => {
            if (err.code === 11000)
                throw new PayloadError(`Account already exists for this user`, 'user', service)
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
                throw new PayloadError(messages, null, service)
            }
            throw new InternalError(err.message, null, service)
        })
        .catch(err => {
            if (err.error) return res.status(err.statusCode).json(err.error)
        })
}

export const getAllAccounts = (req, res) => {
    AccountService.findAll()
        .then(accounts => res.status(200).json(accounts))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const getAccount = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    AccountService.findById(id)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${id} not found`, 'id', service)
            res.status(200).json(account)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const updateAccount = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    AccountService.update(id, req.body)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Account ${id} updated successfully`,
                account
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const lockAccount = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    AccountService.update(id, { "isLocked": true })
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Account ${id} successfully locked`,
                account
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const unlockAccount = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    AccountService.update(id, { "isLocked": false })
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Account ${id} successfully unlocked`,
                account
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const deleteAccount = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    AccountService.delete(id)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Account ${id} deleted successfully` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}