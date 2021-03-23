import { Subjects, Publisher, PaymentCreatedEvent } from '@sgtickets-italo/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}