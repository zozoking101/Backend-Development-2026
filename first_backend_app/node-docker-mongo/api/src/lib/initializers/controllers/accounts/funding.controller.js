// controllers/accounts/funding.controller.js
import { AccountService } from '../../../services/AccountService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'funding'

export const deposit = (req, res) => {
    const { userId } = req.params
    const { amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json(new PayloadError(`Invalid user Id format`, 'userId', service).error)

    if (!amount || amount <= 0)
        return res.status(400).json(new PayloadError(`Deposit amount must be greater than 0`, 'amount', service).error)

    AccountService.credit(userId, amount, 'Deposit')
        .then(account =>
            res.status(200).json({
                message: `Successfully deposited $${amount}`,
                balance: account.balance
            })
        )
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error || { messages: [err.message] })
        )
}

export const withdraw = (req, res) => {
    const { userId } = req.params
    const { amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json(new PayloadError(`Invalid user id format`, 'userId', service).error)

    if (!amount || amount <= 0)
        return res.status(400).json(new PayloadError(`Withdrawal amount must be greater than 0`, 'amount', service).error)

    AccountService.findByUser(userId)
        .then(account => {
            if (!account)
                throw new PayloadError(`No account found for user ${userId}`, 'userId', service)
            if (account.isLocked)
                throw new PayloadError(`Account is locked`, 'isLocked', service)
            if (account.balance < amount)
                throw new PayloadError(`Insufficient balance. Available: $${account.balance}`, 'balance', service)

            return AccountService.debit(userId, amount, 'Withdrawal')
        })
        .then(account =>
            res.status(200).json({
                message: `Successfully withdrew $${amount}`,
                balance: account.balance
            })
        )
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error || { messages: [err.message] })
        )
}

export const getBalance = (req, res) => {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json(new PayloadError(`Invalid account id format`, 'userId', service).error)

    AccountService.findById(userId)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${userId} not found`, 'userId', service)
            res.status(200).json({
                userId,
                balance: account.balance,
                currency: account.currency
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error || { messages: [err.message] })
        )
}