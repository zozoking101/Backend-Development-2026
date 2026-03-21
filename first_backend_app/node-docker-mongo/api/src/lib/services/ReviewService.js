// ReviewService.js
import { Review } from "../../models/ReviewSchema.js"

export const ReviewService = {
    create: (review) => Review.create(review),
    findAll: () => Review.find().populate('user', 'name'),
    findById: (id) => Review.findById(id).populate('user', 'name'),
    findByProduct: (productId) => Review.find({ product: productId }).populate('user', 'name'),
    findByUser: (userId) => Review.find({ user: userId }).populate('product', 'name'),
    getAverageRating: (productId) => Review.aggregate([
        { $match: { product: productId } },
        { $group: {
            _id: '$product',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
        }}
    ]),
    update: (id, data) => Review.findByIdAndUpdate(id, { $set: data }, { new: true }),
    delete: (id) => Review.findByIdAndDelete(id)
}