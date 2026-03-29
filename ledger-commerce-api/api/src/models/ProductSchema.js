// ProductSchema.js
import mongoose from "mongoose"
const { Schema } = mongoose

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: String,
        trim: true
    },

    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    images: {
        type: [String],
        default: []
    },

    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orders: {
        type: [Schema.Types.ObjectId],
        ref: 'Order'
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    tags: {
        type: [String],
        default: []
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

export const Product = mongoose.model('Product', ProductSchema)