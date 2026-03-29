// CategorySchema.js
import mongoose from "mongoose"

const { Schema } = mongoose

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },

    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null      // null = top-level category, otherwise a subcategory
    },

    image: {
        type: String,
        default: null
    },

    isActive: {
        type: Boolean,
        default: true
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
    timestamps: true
})

// auto-generate slug from name before saving
CategorySchema.pre('save', async function() {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-')
    }
})

export const Category = mongoose.model('Category', CategorySchema)