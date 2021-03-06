import { OrderStatus } from "@sgtickets-italo/common"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order"
import { Payment } from "../../models/payment"
import { stripe } from "../../stripe"

it('return a 404 when puchasing an order that does not exists', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'dusaid',
      orderId: Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'dusaid',
      orderId: order.id
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = Types.ObjectId().toHexString()

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'dusaid'
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000)

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .expect(201)
  
  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  
  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
})