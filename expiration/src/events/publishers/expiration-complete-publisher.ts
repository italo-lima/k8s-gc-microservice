import { ExpirationCompleteEvent, Publisher, Subjects } from "@sgtickets-italo/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}