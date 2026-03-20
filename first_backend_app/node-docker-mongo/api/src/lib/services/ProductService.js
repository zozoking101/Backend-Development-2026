import { Product } from '../../models/ProductSchema.js'

export const ProductService = {
    create: (data) => Product.create(data),
    findAll: () => Product.find({}).populate('category').populate('reviews'),
    findById: (id) => Product.findById(id).populate('category').populate('reviews'),
}