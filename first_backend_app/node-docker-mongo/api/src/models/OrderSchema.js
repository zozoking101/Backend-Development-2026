// OrderSchema.js
import mongoose from "mongoose"
const { Schema } = mongoose

const OrderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtPurchase: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false })

const OrderSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: {
        type: [OrderItemSchema],
        required: true
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    shippingAddress: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        country: { type: String, trim: true },
        postalCode: { type: String, trim: true }
    },

    isPaid: {
        type: Boolean,
        default: false
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

export const Order = mongoose.model('Order', OrderSchema)