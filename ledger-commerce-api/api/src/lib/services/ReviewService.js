// ReviewService.js
import { Review } from "../../models/ReviewSchema.js"
import mongoose from 'mongoose'

export const ReviewService = {
    create: (review) => Review.create(review),
    findAll: () => Review.find().populate('user', 'name'),
    findById: (id) => Review.findById(id).populate('user', 'name'),
    findByProduct: (productId) => Review.find({ product: productId }).populate('user', 'name'),
    findByUser: (userId) => Review.find({ user: userId }).populate('product', 'name'),
    getAverageRating: (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID')
    }

    const objectId = new mongoose.Types.ObjectId(productId);

    return Review.aggregate([
        { $match: { product: objectId } },
        { $group: {
            _id: '$product',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
        }}
    ])
},
    update: (id, data) => Review.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after' }),
    delete: (id) => Review.findByIdAndDelete(id)
}