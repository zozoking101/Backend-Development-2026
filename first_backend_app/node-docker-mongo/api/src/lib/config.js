import dotenv from "dotenv"

// Load env.development explicitly
// dotenv.config({ path: ".env.development" }); // alternative script => nodemon --env-file=.env.development src/index.js

export default {
  port: process.env.PORT || 9000,

  api: {
    prefix: '/api',
    version: '/v1',
    version_number: "1.2.0",
    service: "User API",
    docs: "/docs",
    status: "ok",

    routes: {
        users: {
            path: '/users',
            enabled: true
        },
        accounts: {
            path: '/accounts',
            enabled: false
        },
        products: {
            path: '/products',
            enabled: true
        },
        auth: {
            path: '/auth',
            enabled: true
        },
        orders: {
            path: '/orders',
            enabled: false
        }
    }
  }
}