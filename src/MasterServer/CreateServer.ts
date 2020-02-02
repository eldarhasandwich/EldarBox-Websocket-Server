
import * as WebSocket from 'websocket'
import * as http from 'http'
import * as T from 'tswrap'

import * as types from '../types'

import { CreateGame } from './CreateGame'
import { GuestConnection } from './GuestConnection'

import { GetGameById } from '../Games'

export interface CreateServerOptions {
  port: number
}

export function CreateServer ({
  port
}: CreateServerOptions): types.MasterServer {
  const httpServer = http.createServer((request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(404)
    response.end()
  })

  httpServer.listen(port, () => {
    console.log((new Date()) + ' Server is listening on port 8080')
  })

  const wsServer = new WebSocket.server({
    httpServer,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  })

  const originIsAllowed = (origin: string) => {
    // put logic here to detect whether the specified origin is allowed.
    return true
  }

  const masterServer: types.MasterServer = {
    httpServer,
    wsServer,
    games: []
  }

  wsServer.on('request', request => {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject()
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
      return
    }

    const connection = request.accept('echo-protocol', request.origin)
    console.log((new Date()) + ' Connection accepted.')

    connection.on('message', async message => {
      if (message.type !== 'utf8') {
        console.error(`We want message type of utf8 but recieved type ${message.type}`)
        return
      }

      if (!message.utf8Data) {
        console.error('Got message with no data')
        return
      }

      console.log('Received Message: ' + message.utf8Data)
      const messageObject: types.ClientMessage = JSON.parse(message.utf8Data)

      if (messageObject.messageOrder === types.MessageOrder.Subsequent) {
        // subsequent messages should be handled by on message events defined by game logic
        return
      }

      if (messageObject.senderType === types.SenderType.Master) {
        const gameId = 'abcd'
        const gameLogic = GetGameById(gameId)
        if (!gameLogic) {
          return
        }

        const game = await CreateGame({
          masterServer,
          masterClientConnection: connection,
          gameLogic
        })

        if (T.isError(game)) {
          return console.error(`Failed to create game: ${game}`)
        }

        return
      }

      if (messageObject.senderType === types.SenderType.Guest) {
        const guestName = 'eldar'
        const connectCode = '1234'

        GuestConnection(masterServer, connection, guestName, connectCode)
        return
      }
    })

    connection.on('close', (reasonCode, description) => {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
    })
  })

  return masterServer
}
