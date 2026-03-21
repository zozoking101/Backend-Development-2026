import { User } from "../../models/UserSchema.js"

const internalFields = '-password -role -_id -isActive -__v -isBanned -tags'

export const UserService = {
    create: (user) => User.create(user),
    findAll: () => User.find().select(internalFields),
    findById: (id) => User.findById(id).select(internalFields),
    findByEmail: (email) => User.findOne({ email }).select(internalFields),
    update: (id, data) => {
        if (data.name) {
            Object.entries(data.name).forEach(([key, value]) => {
                data[`name.${key}`] = value
            })
            delete data.name
        }

        return User.findByIdAndUpdate(id, { $set: data }, { new: true }).select(internalFields)
    },
    delete: (id) => User.findByIdAndDelete(id)
}