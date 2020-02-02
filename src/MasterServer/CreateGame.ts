
import * as WebSocket from 'websocket'

import { 
  MasterServer,
  GameServer
} from '.'

import { GameLogic } from '../Games'

const generateConnectCode = () => {
  const stamp = Date.now().toString()
  return stamp.substring(stamp.length - 4, stamp.length - 0)
}

export const CreateGame = (ms: MasterServer,  masterClientConnection: WebSocket.connection, gameLogic: GameLogic) => {
  const code = generateConnectCode()

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

  masterClientConnection.on('message', message => {
    gameInstance.gameLogic.masterClientEvents.onMessage(gameInstance, message)
  })

  masterClientConnection.on('close', () => {
    gameInstance.gameLogic.masterClientEvents.onClose(gameInstance)

    gameInstance.guestClients.forEach(client => {
      client.connection.close()
    })

    // TODO: remove game from gamearray
  })

  ms.games.push(gameInstance)
}