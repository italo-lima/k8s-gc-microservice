import { Message } from "node-nats-streaming"
import { OrderCancelledEvent } from "@sgtickets-italo/common"
import { Types } from "mongoose"

import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'dsacfd'
  })
  ticket.set({orderId})

  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket, orderId}
}

it('updated the ticket, publishes an event, and acks the message', async () => {
  const { data, listener, msg, ticket, orderId } = await setup();

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
