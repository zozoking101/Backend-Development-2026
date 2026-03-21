// controllers/orders/returns.controller.js
import { OrderService } from '../../../services/OrderService.js'
import { AccountService } from '../../../services/AccountService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'returns'

export const requestReturn = (req, res) => {
    const { orderId } = req.params

    if (!mongoose.Types.ObjectId.isValid(orderId))
        return res.status(400).json(new PayloadError(`Invalid order id format`, 'orderId', service).error)

    OrderService.findById(orderId)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${orderId} not found`, 'orderId', service)
            if (order.status !== 'delivered')
                throw new PayloadError(`Only delivered orders can be returned`, 'status', service)

            return OrderService.update(orderId, { status: 'return_requested' })
        })
        .then(order =>
            res.status(200).json({
                message: `Return requested for order ${orderId}`,
                order
            })
        )
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const getAllReturns = (req, res) => {
    OrderService.findByStatus('return_requested')
        .then(orders => res.status(200).json(orders))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const approveReturn = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.update(id, { status: 'return_approved' })
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Return approved for order ${id}`,
                order
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const rejectReturn = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.update(id, { status: 'return_rejected' })
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Return rejected for order ${id}`,
                order
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const processRefund = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    OrderService.findById(id)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${id} not found`, 'id', service)
            if (order.status !== 'return_approved')
                throw new PayloadError(`Order must be return_approved before refund`, 'status', service)

            return AccountService.credit(order.buyer, order.totalPrice, `Refund for order ${id}`, id)
        })
        .then(() => OrderService.update(id, { status: 'refunded', isPaid: false }))
        .then(order =>
            res.status(200).json({
                message: `Refund of $${order.totalPrice} processed for order ${id}`,
                order
            })
        )
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}