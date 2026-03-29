// controllers/products/products.controller.js
import { ProductService } from '../../../services/ProductService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'products'

export const productsPing = (req, res) => res.json({ message: 'products pong' })

export const createProduct = (req, res) => {
    ProductService.create(req.body)
        .then(product =>
            res.status(201).json({
                message: `Successfully created product: ${product.name}`,
                product
            })
        )
        .catch(err => {
            if (err.code === 11000) {
                const key = Object.keys(err.keyPattern)[0]
                throw new PayloadError(`Product with ${key} already exists`, key, service)
            }
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
                throw new PayloadError(messages, null, service)
            }
            throw new InternalError(err.message, null, service)
        })
        .catch(err => {
            if (err.error) return res.status(err.statusCode).json(err.error  || { messages: [err.message] })
        })
}

export const getAllProducts = (req, res) => {
    ProductService.findAll()
        .then(products => res.status(200).json(products))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const getProduct = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    ProductService.findById(id)
        .then(product => {
            if (!product)
                throw new PayloadError(`Product with id ${id} not found`, 'id', service)
            res.status(200).json(product)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

export const updateProduct = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    ProductService.update(id, req.body)
        .then(product => {
            if (!product)
                throw new PayloadError(`Product with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Successfully updated product ${id}`,
                product
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}

export const deleteProduct = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    ProductService.delete(id)
        .then(product => {
            if (!product)
                throw new PayloadError(`Product with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Successfully deleted product ${id}: ${product.name}` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error  || { messages: [err.message] })
        )
}