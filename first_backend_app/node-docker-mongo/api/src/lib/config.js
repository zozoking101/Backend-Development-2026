// Load env.development explicitly
// dotenv.config({ path: ".env.development" }); // alternative script => nodemon --env-file=.env.development src/index.js

export default {
    port: process.env.PORT || 9000
}