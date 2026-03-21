// AccountService.js
import { Account } from "../../models/AccountSchema.js"

export const AccountService = {
    create: (account) => Account.create(account),
    findAll: () => Account.find().populate('user', 'name email'),
    findById: (id) => Account.findById(id).populate('user', 'name email'),
    findByUser: (userId) => Account.findOne({ user: userId }),
    findTransaction: (transactionId) => Account.findOne(
        { 'transactions._id': transactionId },
        { 'transactions.$': 1 }         // return only the matching transaction
    ),

    credit: (accountId, amount, description = 'Credit', orderId = null) =>
        Account.findById(accountId)
            .then(account => {
                if (!account) throw new Error(`Account ${accountId} not found`)
                if (account.isLocked) throw new Error(`Account ${accountId} is locked`)

                const newBalance = account.balance + amount

                account.balance = newBalance
                account.transactions.push({
                    type: 'credit',
                    amount,
                    description,
                    order: orderId,
                    balanceAfter: newBalance
                })

                return account.save()
            }),

    debit: (accountId, amount, description = 'Debit', orderId = null) =>
        Account.findById(accountId)
            .then(account => {
                if (!account) throw new Error(`Account ${accountId} not found`)
                if (account.isLocked) throw new Error(`Account ${accountId} is locked`)
                if (account.balance < amount) throw new Error(`Insufficient balance`)

                const newBalance = account.balance - amount

                account.balance = newBalance
                account.transactions.push({
                    type: 'debit',
                    amount,
                    description,
                    order: orderId,
                    balanceAfter: newBalance
                })

                return account.save()
            }),

    update: (id, data) => Account.findByIdAndUpdate(id, { $set: data }, { new: true }),
    delete: (id) => Account.findByIdAndDelete(id)
}