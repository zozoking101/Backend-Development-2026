// controllers/orders/tracking.controller.js
import { OrderService } from '../../../services/OrderService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'tracking'
const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export const getOrderTracking = (req, res) => {
    const { orderId } = req.params

    if (!mongoose.Types.ObjectId.isValid(orderId))
        return res.status(400).json(new PayloadError(`Invalid order id format`, 'orderId', service).error)

    OrderService.findById(orderId)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${orderId} not found`, 'orderId', service)
            res.status(200).json({
                orderId,
                status: order.status,
                updatedAt: order.updatedAt
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const updateOrderStatus = (req, res) => {
    const { orderId } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(orderId))
        return res.status(400).json(new PayloadError(`Invalid order id format`, 'orderId', service).error)

    if (!validStatuses.includes(status))
        return res.status(400).json(new PayloadError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 'status', service).error)

    OrderService.update(orderId, { status })
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${orderId} not found`, 'orderId', service)
            res.status(200).json({
                message: `Order ${orderId} status updated to ${status}`,
                status: order.status
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const getStatusHistory = (req, res) => {
    const { orderId } = req.params

    if (!mongoose.Types.ObjectId.isValid(orderId))
        return res.status(400).json(new PayloadError(`Invalid order id format`, 'orderId', service).error)

    OrderService.findById(orderId)
        .then(order => {
            if (!order)
                throw new PayloadError(`Order with id ${orderId} not found`, 'orderId', service)
            res.status(200).json({
                orderId,
                statusHistory: order.statusHistory || [],
                currentStatus: order.status
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}