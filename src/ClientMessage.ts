
export enum SenderType {
  Master,
  Guest
}

export enum MessageOrder {
  Initial,
  Subsequent
}

export interface ClientMessage {
  senderType: SenderType
  messageOrder: MessageOrder
  payload: any
}

