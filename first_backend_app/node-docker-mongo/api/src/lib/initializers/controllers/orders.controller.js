import { OrderService } from '../../services/OrderService.js'

export const ordersPing = (req, res) => {
    res.json({ 
        message: "orders pong" 
    })
}