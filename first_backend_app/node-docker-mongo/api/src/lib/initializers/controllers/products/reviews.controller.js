// controllers/products/reviews.controller.js
import { ReviewService } from '../../../services/ReviewService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'reviews'

export const createReview = (req, res) => {
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json(new PayloadError(`Invalid product id format`, 'productId', service).error)

    ReviewService.create({ ...req.body, product: productId })
        .then(review =>
            res.status(201).json({
                message: 'Review submitted successfully',
                review
            })
        )
        .catch(err => {
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
                throw new PayloadError(messages, null, service)
            }
            throw new InternalError(err.message, null, service)
        })
        .catch(err => {
            if (err.error) return res.status(err.statusCode).json(err.error)
        })
}

export const getProductReviews = (req, res) => {
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json(new PayloadError(`Invalid product id format`, 'productId', service).error)

    ReviewService.findByProduct(productId)
        .then(reviews => res.status(200).json(reviews))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const updateReview = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    ReviewService.update(id, req.body)
        .then(review => {
            if (!review)
                throw new PayloadError(`Review with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Review updated successfully`,
                review
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const deleteReview = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    ReviewService.delete(id)
        .then(review => {
            if (!review)
                throw new PayloadError(`Review with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Review ${id} deleted successfully` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const getProductRating = (req, res) => {
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json(new PayloadError(`Invalid product id format`, 'productId', service).error)

    ReviewService.getAverageRating(productId)
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this product' });
            }

            const { averageRating, totalReviews } = result[0];
            res.status(200).json({
                averageRating: averageRating || 0,  // Default to 0 if no reviews
                totalReviews: totalReviews || 0
            });
        })
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}