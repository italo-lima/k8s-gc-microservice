import {CustomError} from "./custom-error"

export class DatbaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'
  
  constructor() {
    super('Error connecting to db');

    Object.setPrototypeOf(this, DatbaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
} 