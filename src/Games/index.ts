
import * as WebSocket from 'websocket'

import { GameServer } from '../MasterServer'

export interface MasterEvents {
  onStart: (gs: GameServer) => void
  onClose: (gs: GameServer) => void
  onMessage: (gs: GameServer, data: WebSocket.IMessage) => void
}

export interface ClientEvents {
  onStart: (gs: GameServer, guestName: string) => void
  onClose: (gs: GameServer, guestName: string) => void
  onMessage: (gs: GameServer, guestName: string, data: WebSocket.IMessage) => void

  onAttemptJoin: (gs: GameServer, guestName: string) => { success: boolean, message: string }
  onSuccessfulJoin: (gs: GameServer, guestName: string) => void
}

export interface GameLogic {
  masterClientEvents: MasterEvents
  guestClientEvents: ClientEvents

  maxPlayers: number
}

export const GetGameById = (gameId: string): null | GameLogic => {
  return null
}
