import express from 'express'

const router = express.Router()

export const setupRoutes = (app) => {
    console.log(`\n Testing setup routes function`)

     

    // httpServer.use((req, res, next) => {
    //     console.log(`${req.method} ${req.url}`)
    //      next()
    // })

    router.use('/', (req, res) => {
        console.log(`1️⃣ - Router middleware function one`)
        res.sendStatus(200)
    })
    

    app.use('/api', router)


    // TODO - abstract this to a router file
    // Test route for port config

    // router.get('/api/ping', (req, res) => {
    //     console.log(`ℹ️ - Ping route: ${req.url} ${Date.now()}`)
    //     res.status(200).json({
    //         message: '✅ - Pong: test successful'
    //     })
    // })

    httpServer.use('/', router)


    // router.use((req, res) => { 
    //     res.status(404).json({ 
    //         message: `🚫 ${req.url} route not found! `
    //     }) 
    // })

}