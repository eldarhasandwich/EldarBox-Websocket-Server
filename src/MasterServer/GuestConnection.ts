
import * as WebSocket from 'websocket'

import { 
  Client,
  MasterServer,
  GameServer
} from '.'


export const GuestConnection = (
  ms: MasterServer, 
  guestConnection: WebSocket.connection, 
  guestName: string,
  connectCode: string
) => {
  const gameInstance = ms.games.find(g => g.connectCode === connectCode)

  if (!gameInstance) {
    guestConnection.close()
    return
  }

  if (gameInstance.gameLogic.maxPlayers >= gameInstance.guestClients.length) {
    guestConnection.close()
    return
  }

  if (gameInstance.guestClients.find(g => g.name === guestName)) {
    guestConnection.close()
    return
  }

  const guest: Client = {
    connection: guestConnection,
    name: guestName
  }
  
  gameInstance.guestClients.push(guest)

  gameInstance.gameLogic.guestClientEvents.onSuccessfulJoin(gameInstance, guestName)
  gameInstance.gameLogic.guestClientEvents.onStart(gameInstance, guestName)
}