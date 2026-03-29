// ReviewSchema.js
import mongoose from "mongoose"
import validate from "validate.js"

const { Schema } = mongoose

const constraints = {
    review: () => ({
        presence: { allowEmpty: false },
        length: {
            minimum: 10,
            maximum: 1000
        }
    })
}

const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    title: {
        type: String,
        trim: true,
        maxlength: 100
    },

    body: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => !(validate.single(value, constraints.review())),
            message: (props) => `Review body must be between 10 and 1000 characters`
        }
    },

    isVerifiedPurchase: {
        type: Boolean,
        default: false     // set to true when order containing product is delivered
    },

    isApproved: {
        type: Boolean,
        default: false     // admin approval before review goes public
    },

    helpfulVotes: {
        type: Number,
        default: 0,
        min: 0
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

// one review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true })

export const Review = mongoose.model('Review', ReviewSchema)