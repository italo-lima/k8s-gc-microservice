import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import {sign} from "jsonwebtoken"

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?:string): string[];
    }
  }
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51IX6QCGRE8JMXkNBRhkD6JYuKULLVMEMemhISTowL6eDMNRabTO2qktD5xhGvyNBgLgMIKcnucaPBpXzJq9YXqGQ009vzb65re'

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'keySecret'
  
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = (id?:string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  const token = sign(payload, process.env.JWT_KEY!)

  const session = { jwt: token }

  const sessionJson = JSON.stringify(session)

  const base64 = Buffer.from(sessionJson).toString('base64')

  return [`express:sess=${base64}`]
}