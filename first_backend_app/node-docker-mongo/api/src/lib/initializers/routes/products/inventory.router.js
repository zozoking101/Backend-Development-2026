import Router from 'express'
import { getAllInventory, getLowStock, restockProduct, deductStock } from '../../controllers/products/inventory.controller.js'

const router = Router()

// inventory.router.js — stock management
router.get('/all', getAllInventory)          // all products with stock levels
router.get('/low-stock', getLowStock)       // products below stock threshold
router.put('/restock/:id', restockProduct)  // add stock to a product
router.put('/deduct/:id', deductStock)      // manually deduct stock

export default router