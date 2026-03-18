import { User } from "../../models/UserSchema.js"

export const UserService = {
    create: (user) => User.create(user),
    findAll: () => User.find(),
    findById: (id) => User.findById(id),
    update: (id, user) => User.findByIdAndUpdate(id, user, { new: true }),
    delete: (id) => User.findByIdAndDelete(id)
}