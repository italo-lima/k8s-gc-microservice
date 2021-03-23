import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@sgtickets-italo/common"

import { natsWrapper } from "../../../nats-wrapper"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    price: 10,
    userId: 'jgsfig',
    status: OrderStatus.Created,
    version: 0
  })

  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'jgsfig'
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, order, msg }
}

it('update the status of order', async () => {
  const { data, listener, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})