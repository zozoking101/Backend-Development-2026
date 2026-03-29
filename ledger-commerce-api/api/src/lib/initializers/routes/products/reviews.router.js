import Router from 'express'
import { getProductReviews, getProductRating, createReview, updateReview, deleteReview } from '../../controllers/products/reviews.controller.js'

const router = Router()

// reviews.router.js — product reviews and ratings
router.post('/new/:productId', createReview)
router.get('/all/:productId', getProductReviews)
router.put('/update/:id', updateReview)
router.delete('/delete/:id', deleteReview)
router.get('/rating/:productId', getProductRating)  // avg rating

export default router