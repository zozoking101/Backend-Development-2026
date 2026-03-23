// ProductService.js
import { Product } from "../../models/ProductSchema.js"

export const ProductService = {
    create: (product) => Product.create(product),
    findAll: () => Product.find(),
    findById: (id) => Product.findById(id),
    findByCategory: (categoryId) => Product.find({ category: categoryId }),
    findLowStock: (threshold) => Product.find({ stock: { $lte: threshold }, isAvailable: true }),
    findLowStockByProduct: (productId,threshold) => Product.find({ _id: productId, stock: { $lte: threshold }, isAvailable: true }).populate('_id', 'name'),
    findLowStockByCategory: (categoryId, threshold) => Product.find({ category: categoryId, stock: { $lte: threshold }, isAvailable: true }).populate('category', 'name'),
    update: (id, data) => Product.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after' }),
    adjustStock: (id, amount) => Product.findByIdAndUpdate(
        id,
        { $inc: { stock: amount } },   // $inc handles both positive and negative
        { returnDocument: 'after' }
    ),
    deleteByCategory: (categoryId) => Product.deleteMany({ category: categoryId }),
    delete: (id) => Product.findByIdAndDelete(id)
}