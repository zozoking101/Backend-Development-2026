import { User } from "../../models/UserSchema.js"
import { internalFields } from '../initializers/controllers/users.controller.js'

export const UserService = {
    create: (user) => User.create(user),
    findAll: () => User.find(),
    findById: (id) => User.findById(id),
    update: (id, data) => {
        if (data.name) {
            Object.entries(data.name).forEach(([key, value]) => {
                data[`name.${key}`] = value
            })
            delete data.name
        }

        return User.findByIdAndUpdate(id, { $set: data }, { new: true })
    },
    delete: (id) => User.findByIdAndDelete(id)
}