// Two types of errors:
// 1. Payload/validation (400) errors
// 2. Internal server (500) errors

class BaseError extends Error {
    constructor(type = null, message = 'An error occurred', code = 500, key = null, service = null) {
        super(Array.isArray(message) ? JSON.stringify(message) : message)
        this.name = this.constructor.name
        this.statusCode = code
        this.error = {
            type,
            timestamp: new Date().toISOString(),
            code,
            messages: Array.isArray(message) ? message : [message],
            key,
            service
        }
    }
}

export class PayloadError extends BaseError {
    constructor(message = 'Invalid payload', key = null, service = null) {
        super('payload', message, 400, key, service)
    }
}

export class InternalError extends BaseError {
    constructor(message = 'Internal server error', key = null, service = null) {
        super('internal', message, 500, key, service)
    }
}