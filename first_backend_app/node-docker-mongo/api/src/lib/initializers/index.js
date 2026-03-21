import express from 'express'
import accountsRouter from './routes/accounts/accounts.router.js'
import ordersRouter from './routes/orders/orders.router.js'
import productsRouter from './routes/products/products.router.js'
import usersRouter from './routes/users/users.router.js'

import { accountsLogger, ordersLogger, usersLogger, productsLogger } from './middleware/logger.middleware.js'
import { notFound } from './middleware/notFound.middleware.js'
import { setupMongo } from "./mongo.js"

export const initializeApp = async(app, config) => {
    
    setupMongo(config)
    console.log("🔥 APP INITIALIZED")

    // body parser (json -> javascript object)
    app.use(express.json())

    const { prefix, version, routes, version_number, service, docs, status } = config.api
    const base = prefix + (version || '')
    const endpoints = { base }

    app.get('/', (req, res) => {
        Object.keys(routes).forEach((key) => {
            const route = routes[key]
            if (route.enabled) endpoints[key] = base + route.path
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

    ```
└── routes/
    └── accounts/
        ├── accounts.router.js      (mounts all subrouters)
        ├── transactions.router.js  /api/v1/accounts/transactions
        └── funding.router.js       /api/v1/accounts/funding
    ```

    // accounts mounted first (required for order processing)
    if (routes.accounts.enabled)
    app.use(base + routes.accounts.path, accountsLogger, accountsRouter)

    // routes + middleware
    if (routes.users.enabled)
    app.use(base + routes.users.path, usersLogger, usersRouter)

    if (routes.products.enabled)
    app.use(base + routes.products.path, productsLogger, productsRouter)

    if (routes.orders.enabled)
    app.use(base + routes.orders.path, ordersLogger, ordersRouter)

    // 404 handler (always last)
    app.use(notFound)
}