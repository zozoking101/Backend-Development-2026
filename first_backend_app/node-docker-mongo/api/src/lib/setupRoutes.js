import express from 'express'
import productsRouter from './routes/products.router.js'
import usersRouter from './routes/users.router.js'
import accountsRouter from './routes/accounts.router.js'
import ordersRouter from './routes/orders.router.js'
import { accountsLogger, ordersLogger, usersLogger, productsLogger } from './middleware/logger.middleware.js'
import { notFound } from './middleware/notFound.middleware.js'

export const setupRoutes = (app, config) => {
    console.log(`\n⚙️ Testing setupRoutes()`)

    // body parser
    app.use(express.json())

    const { prefix, version, routes, version_number, service, docs, status } = config.api
    const base = prefix + (version || '')
    const endpoints = { base }
    app.get('/', (req, res) => {

        Object.keys(routes).forEach((key) => {
            const route = routes[key]
            if (route.enabled) {
            endpoints[key] = base + route.path
            }
        })

        res.json({
            message: "👋🏽 API running",
            service,
            version: version_number,
            docs,
            status,
            endpoints
        })
    })

    // routes + middleware
    if (routes.users.enabled) {
    app.use(base + routes.users.path, usersLogger, usersRouter)
    }

    if (routes.products.enabled) {
    app.use(base + routes.products.path, productsLogger, productsRouter)
    }

    if (routes.accounts.enabled) {
    app.use(base + routes.accounts.path, accountsLogger, accountsRouter)
    }

    if (routes.orders.enabled) {
    app.use(base + routes.orders.path, ordersLogger, ordersRouter)
    }

    // 404 handler (always last)
    app.use(notFound)
}