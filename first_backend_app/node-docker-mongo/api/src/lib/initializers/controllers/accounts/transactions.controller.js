// controllers/accounts/transactions.controller.js
import { AccountService } from '../../../services/AccountService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'transactions'

export const getTransactions = (req, res) => {
    const { accountId } = req.params

    if (!mongoose.Types.ObjectId.isValid(accountId))
        return res.status(400).json(new PayloadError(`Invalid account id format`, 'accountId', service).error)

    AccountService.findById(accountId)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${accountId} not found`, 'accountId', service)
            res.status(200).json(account.transactions)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

export const getTransaction = (req, res) => {
    const { id } = req.params

    AccountService.findTransaction(id)
        .then(transaction => {
            if (!transaction)
                throw new PayloadError(`Transaction with id ${id} not found`, 'id', service)
            res.status(200).json(transaction)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

export const filterTransactions = (req, res) => {
    const { accountId } = req.params
    const { type, from, to } = req.query

    if (!mongoose.Types.ObjectId.isValid(accountId))
        return res.status(400).json(new PayloadError(`Invalid account id format`, 'accountId', service).error)

    AccountService.findById(accountId)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${accountId} not found`, 'accountId', service)

            let transactions = account.transactions

            if (type) transactions = transactions.filter(t => t.type === type)
            if (from) transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(from))
            if (to) transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(to))

            res.status(200).json(transactions)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}