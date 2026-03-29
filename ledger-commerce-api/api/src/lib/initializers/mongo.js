import mongoose from 'mongoose';

export const setupMongo = async ({ mongo }) => {
    const {protocol, username, password, host, port, database} = mongo
    const connectionUri = `${protocol}://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=admin`
  

    try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(connectionUri)

    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed:')
    console.error(err.message)
    process.exit(1)
  }

  
}