// controllers/products/categories.controller.js
import { CategoryService } from '../../../services/CategoryService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'

const service = 'categories'

export const createCategory = (req, res) => {
    CategoryService.create(req.body)
        .then(category =>
            res.status(201).json({
                message: `Successfully created category: ${category.name}`,
                category
            })
        )
        .catch(err => {
            if (err.code === 11000)
                throw new PayloadError(`Category ${req.body.name} already exists`, 'name', service)
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
                throw new PayloadError(messages, null, service)
            }
            throw new InternalError(err.message, null, service)
        })
        .catch(err => {
            if (err.error) return res.status(err.statusCode).json(err.error)
        })
}

export const getAllCategories = (req, res) => {
    CategoryService.findAll()
        .then(categories => res.status(200).json(categories))
        .catch(err =>
            res.status(500).json(new InternalError(err.message, null, service).error)
        )
}

export const getCategory = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    CategoryService.findById(id)
        .then(category => {
            if (!category)
                throw new PayloadError(`Category with id ${id} not found`, 'id', service)
            res.status(200).json(category)
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const updateCategory = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    CategoryService.update(id, req.body)
        .then(category => {
            if (!category)
                throw new PayloadError(`Category with id ${id} not found`, 'id', service)
            res.status(200).json({
                message: `Successfully updated category ${id}`,
                category
            })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const deleteCategory = (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json(new PayloadError(`Invalid id format: ${id}`, 'id', service).error)

    CategoryService.delete(id)
        .then(category => {
            if (!category)
                throw new PayloadError(`Category with id ${id} not found`, 'id', service)
            res.status(200).json({ message: `Successfully deleted category ${id}` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}