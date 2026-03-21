// ProductService.js
import { Product } from "../../models/ProductSchema.js"

export const ProductService = {
    create: (product) => Product.create(product),
    findAll: () => Product.find(),
    findById: (id) => Product.findById(id),
    findByCategory: (categoryId) => Product.find({ category: categoryId }),
    findLowStock: (threshold = 10) => Product.find({ stock: { $lte: threshold }, isAvailable: true }),
    update: (id, data) => Product.findByIdAndUpdate(id, { $set: data }, { new: true }),
    adjustStock: (id, amount) => Product.findByIdAndUpdate(
        id,
        { $inc: { stock: amount } },   // $inc handles both positive and negative
        { new: true }
    ),
    delete: (id) => Product.findByIdAndDelete(id)
}