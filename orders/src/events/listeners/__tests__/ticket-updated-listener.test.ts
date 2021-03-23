import { Message } from "node-nats-streaming"
import { TicketUpdatedEvent } from "@sgtickets-italo/common"
import { Types } from "mongoose"

import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  })

  await ticket.save()

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: "hjdksfh"
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket}
}

it('finds, updates, and saves a ticket', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()
  
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack id the event has a skipped version numver', async () => {
  const { data, listener, msg } = await setup()
  
  data.version = 10

  try {
    await listener.onMessage(data, msg)

  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})