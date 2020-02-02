
import * as WebSocket from 'websocket'
import * as http from 'http'

import { GameLogic } from '../Games'

import { CreateServer } from './CreateServer'
import { CreateGame } from './CreateGame'
import { GuestConnection } from './GuestConnection'

export interface Client {
  connection: WebSocket.connection
  name?: string
}

export interface GameServer {
  gameId: string
  connectCode: string

  masterClient: Client
  guestClients: Client[]
  
  gameLogic: GameLogic
}

export interface MasterServer {
  httpServer: http.Server
  wsServer: WebSocket.server
  games: GameServer[]
}

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
