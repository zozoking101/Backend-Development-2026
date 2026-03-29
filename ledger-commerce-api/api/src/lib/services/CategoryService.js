// CategoryService.js
import { Category } from "../../models/CategorySchema.js"

export const CategoryService = {
    create: (category) => Category.create(category),
    findAll: () => Category.find(),
    findById: (id) => Category.findById(id),
    findByName: (name) => Category.findOne({ name }),
    update: (id, data) => Category.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after' }),
    delete: (id) => Category.findByIdAndDelete(id)
}