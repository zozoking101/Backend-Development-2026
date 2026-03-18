import mongoose from "mongoose"
const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
      first: {
        type: String,
        required: true,
        trim: true
      },
      last: {
        type: String,
        required: true,
        trim: true
      }
    },

    id: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    age: {
      type: Number,
      min: 0
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product'
    },

    orders: {
      type: [Schema.Types.ObjectId],
      ref: 'Order'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isBanned: {
      type: Boolean,
      default: false
    },

    tags: {
      type: [String],
      default: []
    },

    metadata: {
      source: {
        type: String,
        default: 'unknown'
      },
      region: {
        type: String
      }
    }
  },
  {
    timestamps: true // replaces created & updated
})

export const User = mongoose.model('User', UserSchema)