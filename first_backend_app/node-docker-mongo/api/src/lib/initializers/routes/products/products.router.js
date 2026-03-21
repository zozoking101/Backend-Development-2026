// products.router.js
import { Router } from 'express'
import categoriesRouter from './categories.router.js'
import inventoryRouter from './inventory.router.js'
import reviewsRouter from './reviews.router.js'
import {
    createProduct, getAllProducts, getProduct, updateProduct, deleteProduct
} from '../../controllers/products/products.controller.js'

const router = Router()

// mount subrouter first before /:id 
// otherwise /:id will catch /categories as an id
router.use('/categories', categoriesRouter)
router.use('/inventory', inventoryRouter)
router.use('/reviews', reviewsRouter)

router.post('/new', createProduct)
router.get('/all', getAllProducts)
router.get('/:id', getProduct)
router.put('/update/:id', updateProduct)
router.delete('/delete/:id', deleteProduct)

export default router