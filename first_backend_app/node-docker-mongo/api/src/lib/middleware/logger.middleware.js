export const apiLogger = (req, res, next) => {
    console.log(`1️⃣ - ${req.method} API route: ${req.originalUrl}`)
    next()
}

export const usersLogger = (req, res, next) => {
    console.log(`2️⃣ - ${req.method} USERS route: ${req.originalUrl}`)
    next()
}

export const productsLogger = (req, res, next) => {
    console.log(`3️⃣ - ${req.method} PRODUCTS route: ${req.originalUrl}`)
    next()
}