import mongoose from "mongoose"
import validate from "validate.js"


const constraints = {
  email: () => ({
    presence: { allowEmpty: false },
    email: true
  }),

  name: () => ({
    presence: { allowEmpty: false },
    length: {
      minimum: 2,
      maximum: 100
    },
    format: {
      pattern: /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/,
    }
  })
}

const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => !(validate.single(value, constraints.name)),  // valid => undefined => true
            message: (props) => `${props.value} is not a valid first name!`
        }
      },
      last: {
        type: String,
        required: true,
        trim: true, 
        validate: {
            validator: (value) => !(validate.single(value, constraints.name)),  // valid => undefined => true
            message: (props) => `${props.value} is not a valid last name!`
        }
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
        trim: true,
        validate: {
            validator: (value) => !(validate.single(value, constraints.email)),  // valid => undefined => true
            message: (props) => `${props.value} is not a valid email address!`
        }
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