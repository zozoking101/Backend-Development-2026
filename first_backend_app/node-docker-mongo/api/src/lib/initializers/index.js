import { setupMongo } from "./mongo.js"

export const initializeApp = async(app, config) => {
    
    // initialize mongodb
    setupMongo(config)
    console.log("🔥 APP INITIALIZED")
}