
import * as WebSocket from 'websocket'

import { 
  Client,
  MasterServer,
  GameServer
} from '.'

import { GetGameById } from '../Games'

const generateConnectCode = () => {
  const stamp = Date.now().toString()
  return stamp.substring(stamp.length - 4, stamp.length - 0)
}

export const CreateGame = (ms: MasterServer,  masterClientConnection: WebSocket.connection, gameId: string) => {
  const code = generateConnectCode()

  const gameLogic = GetGameById(gameId)

  const gameInstance: GameServer = {
    gameId: code,
    connectCode: code,
    masterClient: {
      connection: masterClientConnection
    },
    guestClients: [],

    gameLogic
  }

  gameInstance.gameLogic.masterClientEvents.onStart(gameInstance)

  ms.games.push(gameInstance)
}