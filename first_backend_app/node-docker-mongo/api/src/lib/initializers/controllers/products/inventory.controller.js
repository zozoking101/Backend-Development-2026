// controllers/products/inventory.controller.js
import { ProductService } from '../../../services/ProductService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'inventory'

export const getAllInventory = (req, res) => {
    ProductService.findAll()
        .then(products =>
            res.status(200).json(
                products.map(p => ({
                    id: p._id,
                    name: p.name,
                    stock: p.stock,
                    isAvailable: p.isAvailable
                }))
            )
        )
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const getLowStock = (req, res) => {
    const threshold = Number(req.query.threshold) || 10

    ProductService.findLowStock(threshold)
        .then(products => res.status(200).json(products))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const restockProduct = (req, res) => {
    const { id } = req.params
    const { amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    if (!amount || amount <= 0)
        return res.status(400).json(new PayloadError('Restock amount must be greater than 0', 'amount', service).error)

    ProductService.adjustStock(id, amount)
        .then(product => {
            if (!product)
                throw new PayloadError(`Product with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Successfully restocked product ${id} by ${amount} units`,
                stock: product.stock
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const deductStock = (req, res) => {
    const { id } = req.params
    const { amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    if (!amount || amount <= 0)
        return res.status(400).json(new PayloadError('Deduct amount must be greater than 0', 'amount', service).error)

    ProductService.adjustStock(id, -amount)
        .then(product => {
            if (!product)
                throw new PayloadError(`Product with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Successfully deducted ${amount} units from product ${id}`,
                stock: product.stock
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}