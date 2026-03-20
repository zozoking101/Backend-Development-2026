import { Order } from "../../models/OrderSchema.js"

export const OrderService = {
    create: (order) => Order.create(order),
    findAll: () => Order.find(),
    findById: (id) => Order.findById(id)
}