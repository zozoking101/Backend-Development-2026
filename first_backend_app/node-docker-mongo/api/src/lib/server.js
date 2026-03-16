import express from 'express'
import config from './config.js'
import apiRouter from './routes/api.router.js'
import productsRouter from './routes/products.router.js'
import usersRouter from './routes/users.router.js'
import accountsRouter from './routes/accounts.router.js'
// import { setupRoutes } from './setupRoutes.js'

import { apiLogger, usersLogger, productsLogger } from './middleware/logger.middleware.js'
import { notFound } from './middleware/notFound.middleware.js'



console.log("🔥 SERVER RESTARTED")


export const startServer = () => {

    // const httpServer = express()
    const app = express()
    const port = config.port

    // body parser
    app.use(express.json())

    // setupRoutes(httpServer)
    app.get('/', (req, res) => {
    res.json({
            message: "👋🏽 API running",
            endpoints: {
                api: "/api",
                users: "/users",
                products: "/products"
            }
        })
    })

    // routes + middleware
    app.use('/api', apiLogger, apiRouter)
    app.use('/users', usersLogger, usersRouter)
    app.use('/products', productsLogger, productsRouter)
    app.use('/accounts', accountsRouter)

    // 404 handler (always last)
    app.use(notFound)
   
   

    try {

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (err){
        throw new Error(err)
    }
}