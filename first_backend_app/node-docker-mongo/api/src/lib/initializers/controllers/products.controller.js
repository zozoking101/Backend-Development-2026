import { ProductService } from '../../services/ProductService.js'

export const productsPing = (req, res) => {
    res.json({ 
        message: "products pong" 
    })
}