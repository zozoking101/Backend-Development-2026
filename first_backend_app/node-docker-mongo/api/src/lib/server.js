import express from 'express'
import config from './config.js'
import dotenv from "dotenv"

// Load env.development explicitly
// dotenv.config({ path: ".env.development" }); // alternative script => nodemon --env-file=.env.development src/index.js

export const startServer = () => {

    const httpServer = express();
    const port = config.port

    // TODO - abstract this to a router file
    // Test route for port config
    httpServer.get('/ping', (req, res) => {
        console.log(`ℹ️ - Ping route: ${req.url} ${Date.now()}`)
        res.status(200).json({
            message: '✅ - Pong: test successful'
        })
    })

    try {

        httpServer.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (err){
        throw new Error(err)
    }
}



// const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello World')
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`))