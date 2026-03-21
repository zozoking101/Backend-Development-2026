// controllers/accounts/funding.controller.js
import { AccountService } from '../../../services/AccountService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'funding'

export const deposit = (req, res) => {
    const { accountId } = req.params
    const { amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(accountId))
        return res.status(400).json(new PayloadError(`Invalid account id format`, 'accountId', service).error)

    if (!amount || amount <= 0)
        return res.status(400).json(new PayloadError(`Deposit amount must be greater than 0`, 'amount', service).error)

    AccountService.credit(accountId, amount, 'Deposit')
        .then(account =>
            res.status(200).json({
                message: `Successfully deposited $${amount}`,
                balance: account.balance
            })
        )
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const withdraw = (req, res) => {
    const { accountId } = req.params
    const { amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(accountId))
        return res.status(400).json(new PayloadError(`Invalid account id format`, 'accountId', service).error)

    if (!amount || amount <= 0)
        return res.status(400).json(new PayloadError(`Withdrawal amount must be greater than 0`, 'amount', service).error)

    AccountService.findById(accountId)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${accountId} not found`, 'accountId', service)
            if (account.balance < amount)
                throw new PayloadError(`Insufficient balance. Available: $${account.balance}`, 'balance', service)
            if (account.isLocked)
                throw new PayloadError(`Account is locked`, 'isLocked', service)

            return AccountService.debit(accountId, amount, 'Withdrawal')
        })
        .then(account =>
            res.status(200).json({
                message: `Successfully withdrew $${amount}`,
                balance: account.balance
            })
        )
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const getBalance = (req, res) => {
    const { accountId } = req.params

    if (!mongoose.Types.ObjectId.isValid(accountId))
        return res.status(400).json(new PayloadError(`Invalid account id format`, 'accountId', service).error)

    AccountService.findById(accountId)
        .then(account => {
            if (!account)
                throw new PayloadError(`Account with id ${accountId} not found`, 'accountId', service)
            res.status(200).json({
                accountId,
                balance: account.balance,
                currency: account.currency
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}