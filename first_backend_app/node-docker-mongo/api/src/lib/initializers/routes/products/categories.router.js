// categories.router.js
import { Router } from 'express'
import {
    createCategory, getAllCategories, getCategory, updateCategory, deleteCategory
} from '../../controllers/products/categories.controller.js'

const router = Router()

// /api/v1/products/categories
router.post('/new', createCategory)
router.get('/all', getAllCategories)
router.get('/:id', getCategory)
router.put('/update/:id', updateCategory)
router.delete('/delete/:id', deleteCategory)

export default router