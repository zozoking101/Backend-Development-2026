import mongoose from "mongoose"

const { Schema } = mongoose

const TransactionSchema = new Schema({
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    balanceAfter: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true })

const AccountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true        // one account per user
    },

    balance: {
        type: Number,
        default: 0,
        min: 0              // prevents negative balance
    },

    currency: {
        type: String,
        default: 'USD',
        enum: ['USD']       // locked to USD for now, easy to expand later
    },

    transactions: {
        type: [TransactionSchema],
        default: []
    },

    isLocked: {
        type: Boolean,
        default: false      // lock account if suspicious activity
    },

    metadata: {
        source: {
            type: String,
            default: 'unknown'
        },
        region: {
            type: String
        }
    }
},
{
    timestamps: true
})

export const Account = mongoose.model('Account', AccountSchema)