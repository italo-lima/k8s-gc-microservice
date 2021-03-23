import { Publisher, Subjects, TicketCreatedEvent } from "@sgtickets-italo/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}