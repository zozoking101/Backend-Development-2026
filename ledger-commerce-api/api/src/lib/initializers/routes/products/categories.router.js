// categories.router.js
import { Router } from 'express'
import {
    createCategory, getAllCategories, getCategory, updateCategory, activateCategory, deactivateCategory, deleteCategory
} from '../../controllers/products/categories.controller.js'

const router = Router()

// /api/v1/products/categories
router.post('/new', createCategory)
router.get('/all', getAllCategories)
router.get('/:id', getCategory)
router.put('/update/:id', updateCategory)
router.put('/activate/:id', activateCategory)
router.put('/deactivate/:id', deactivateCategory)
router.delete('/delete/:id', deleteCategory)

export default router