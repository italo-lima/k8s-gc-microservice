import { Publisher, OrderCancelledEvent, Subjects } from "@sgtickets-italo/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}