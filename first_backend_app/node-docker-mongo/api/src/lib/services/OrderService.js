// OrderService.js
import { Order } from "../../models/OrderSchema.js"

export const OrderService = {
    create: (order) => Order.create(order),
    findAll: () => Order.find().populate('buyer', 'name email').populate('items.product', 'name price'),
    findById: (id) => Order.findById(id).populate('buyer', 'name email').populate('items.product', 'name price'),
    findByUser: (userId) => Order.find({ buyer: userId }).populate('items.product', 'name price'),
    findByStatus: (status) => Order.find({ status }).populate('buyer', 'name email'),
    update: (id, data) => Order.findByIdAndUpdate(id, { $set: data }, { new: true }),
    delete: (id) => Order.findByIdAndDelete(id)
}