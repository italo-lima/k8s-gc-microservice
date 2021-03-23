import { Schema, model, Model, Document } from "mongoose"
import { OrderStatus } from "@sgtickets-italo/common"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

import { TicketDoc } from "./ticket"

export { OrderStatus }

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  }, 
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      }
    }
  }
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = model<OrderDoc, OrderModel>('order', orderSchema)

export { Order }