
import * as WebSocket from 'websocket'
import * as T from 'tswrap'

import {
  MasterServer,
  GameServer
} from '../types'

import { GameLogic } from '../Games'

export async function generateConnectCode (): T.R<string> {
  const stamp = Date.now().toString()
  return stamp.substring(stamp.length - 4, stamp.length - 0)
}

interface CreateGameOptions {
  masterServer: MasterServer,
  masterClientConnection: WebSocket.connection,
  gameLogic: GameLogic
}

export async function CreateGame ({
  masterServer,
  masterClientConnection,
  gameLogic
}: CreateGameOptions): T.R<GameServer> {
  const code = await generateConnectCode()

  if (T.isError(code)) return code

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

  masterServer.games.push(gameInstance)

  return gameInstance
}
