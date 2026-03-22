// import { UserService } from '../../../services/UserService.js'
// import { PayloadError, InternalError } from '../../../../errors/Errors.js'
// import mongoose from 'mongoose'

const service = 'user'
export const internalFields = '-password -role -_id -isActive -__v -isBanned -tags'

// custom error structure
// const errorJSON = {
//   "error": {
//       "type": "internal/payload",
//       "timestamp": "2021-05-26T12:20:25.000Z",
//       "code": 500,
//       "messages": [
//         "Internal server error"
//       ],
//       "key": "email",
//       "service": "user",
//   }
// }

export const usersPing = (req, res) => {
  res.json({ message: "users pong" })
}