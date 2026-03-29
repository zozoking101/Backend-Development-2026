import express from 'express'
import config from './config.js'

// import { setupRoutes } from './setupRoutes.js'
import { initializeApp } from './initializers/index.js'

console.log("🔥 SERVER RESTARTED")
export const startServer = async () => {

    const app = express()
    const port = config.port

    // setupRoutes(app, config)
    await initializeApp(app, config)
   
    try {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (err){
        throw new Error(err)
    }
}