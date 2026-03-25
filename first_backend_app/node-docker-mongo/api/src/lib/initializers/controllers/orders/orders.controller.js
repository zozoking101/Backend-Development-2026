// controllers/orders/orders.controller.js
import { OrderService } from '../../../services/OrderService.js'
import { AccountService } from '../../../services/AccountService.js'
import { ProductService } from '../../../services/ProductService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'orders'

export const ordersPing = (req, res) => res.json({ message: 'orders pong' })

export const createOrder = (req, res) => {
    const { buyer, items, totalPrice, shippingAddress } = req.body

    if (!mongoose.Types.ObjectId.isValid(buyer))
        return res.status(400).json(new PayloadError(`Invalid buyer id format`, 'buyer', service).error)

    let createdOrder = null

    AccountService.findByUser(buyer)
        .then(account => {
            if (!account)
                throw new PayloadError(`No account found for user ${buyer}`, 'buyer', service)
            if (account.balance < totalPrice)
                throw new PayloadError(`Insufficient balance. Required: $${totalPrice}, Available: $${account.balance}`, 'balance', service)

            return OrderService.create({ buyer, items, totalPrice, shippingAddress })
        })
        .then(order => {
            createdOrder = order
            return AccountService.debit(buyer, totalPrice, `Payment for order ${order._id}`, order._id)
        })
        .then(() => ProductService.deductOrderStock(items))
        .then(() =>
            res.status(201).json({
                message: `Order created successfully`,
                order: createdOrder
            })
        )
        .catch(err => {
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
                throw new PayloadError(messages, null, service)
            }
            if (err.error) return res.status(err.statusCode).json(err.error)
            res.status(500).json(new InternalError(err.message, null, service).error)
        })
}

export const getAllOrders = (req, res) => {
    OrderService.findAll()
        .then(orders => res.status(200).json(orders))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const getOrder = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.findById(id)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json(order)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const updateOrder = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.update(id, req.body)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Order ${id} updated successfully`,
                order
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const verifyOrderPayment = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.update(id, { "isPaid": true })
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Order ${id} payment verified successfully`,
                order
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const unverifyOrderPayment = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.update(id, { "isPaid": false })
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Order ${id} payment could not be verified`,
                order
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}



export const deleteOrder = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.delete(id)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Order ${id} deleted successfully` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}