
import * as WebSocket from 'websocket'
import * as http from 'http'

import * as MasterServer from '.'

import { CreateGame } from './CreateGame'
import { GuestConnection } from './GuestConnection'

import { GetGameById } from '../Games'

export const CreateServer = (): MasterServer.MasterServer => {

  const httpServer = http.createServer((request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(404)
    response.end()
  })

  httpServer.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080')
  })

  const wsServer = new WebSocket.server({
    httpServer: httpServer,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  })

  const originIsAllowed = (origin: string) => {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  const masterServer: MasterServer.MasterServer = {
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

    connection.on('message', message => {
      if (message.type !== 'utf8') {
        console.error(`We want message type of utf8 but recieved type ${message.type}`)
        return
      }

      console.log('Received Message: ' + message.utf8Data)
      const messageObject: MasterServer.ClientMessage = JSON.parse(message.utf8Data)

      if (messageObject.messageOrder === MasterServer.MessageOrder.Subsequent) {
        // subsequent messages should be handled by on message events defined by game logic
        return
      }

      if (messageObject.senderType === MasterServer.SenderType.Master) {
        const gameId = 'abcd'
        const gameLogic = GetGameById(gameId)
        if (!gameLogic) {
          return
        }

        CreateGame(masterServer, connection, gameLogic)
        return
      }

      if (messageObject.senderType === MasterServer.SenderType.Guest) {
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
