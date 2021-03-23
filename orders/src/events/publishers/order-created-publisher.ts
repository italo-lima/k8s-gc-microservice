import { Publisher, OrderCreatedEvent, Subjects } from "@sgtickets-italo/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}

