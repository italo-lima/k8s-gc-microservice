import { Publisher, Subjects, TicketUpdatedEvent } from "@sgtickets-italo/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}