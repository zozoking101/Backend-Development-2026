// controllers/users/auth.controller.js
import { UserService } from '../../../services/UserService.js'
import { PayloadError, InternalError } from '../../../../errors/Errors.js'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const service = 'auth'

export const register = (req, res) => {
    const { password, ...rest } = req.body

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err)
            return res.status(500).json(new InternalError(err.message, null, service).error)

        UserService.create({ ...rest, password: hashedPassword })
            .then(user =>
                res.status(201).json({
                    message: `Successfully registered: ${user.name.first} ${user.name.last} 👋🏽`,
                    user
                })
            )
            .catch(err => {
                if (err.code === 11000) {
                    const key = Object.keys(err.keyPattern)[0] || 'email'
                    throw new PayloadError(`User with ${key} ${req.body[key]} already exists`, key, service)
                }
                if (err.name === 'ValidationError') {
                    const messages = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
                    throw new PayloadError(messages, null, service)
                }
                throw new InternalError(err.message, null, service)
            })
            .catch(err => {
                if (err.error) return res.status(err.statusCode).json(err.error)
            })
    })
}

export const login = (req, res) => {
    const { email, password } = req.body

    UserService.findByEmail(email)
        .then(user => {
            if (!user)
                throw new PayloadError('Invalid email or password', 'email', service)
            // password comparison will go here when auth is implemented
            res.status(200).json({ message: 'Login successful', user })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const logout = (req, res) => {
    // token invalidation will go here when auth is implemented
    res.status(200).json({ message: 'Logout successful' })
}

export const refreshToken = (req, res) => {
    // token refresh will go here when auth is implemented
    res.status(200).json({ message: 'Token refreshed' })
}

export const forgotPassword = (req, res) => {
    const { email } = req.body

    UserService.findByEmail(email)
        .then(user => {
            if (!user)
                throw new PayloadError(`No account found with email ${email}`, 'email', service)
            // email sending logic will go here
            res.status(200).json({ message: `Password reset link sent to ${email}` })
        })
        .catch(err =>
            res.status(err.statusCode || 500).json(err.error)
        )
}

export const resetPassword = (req, res) => {
    const { token, password } = req.body
    // token verification + password update will go here
    res.status(200).json({ message: 'Password reset successful' })
}