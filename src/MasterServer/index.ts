
import * as WebSocket from 'websocket'

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
  games: GameServer[]
}

export default {
  CreateServer,
  CreateGame,
  GuestConnection
}
