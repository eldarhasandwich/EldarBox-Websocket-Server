import socketIO from 'socket.io'

import * as event from './config/EventNames'
import { Game } from './Classes/Game'
import { GameType, RetrieveGameLogic, GameLogic } from './GameLogic'

const rooms: { [connectCode: string]: Game } = {}

const RegisterCreateRoomEventOnSocket = (server: socketIO.Server, socket: socketIO.Socket) => {
  socket.on(event.CREATEROOM, (message: { gameTypeId: GameType, playerName?: string }) => {

    const gameLogic = RetrieveGameLogic(message.gameTypeId)
    if (!gameLogic) {
      socket.emit(event.INDEXERROR, { reason: 'No game of this type' })
      return
    }

    const newGameRequest = {
      name: 'a game',
      gameType: message.gameTypeId,
      gameLogic: new GameLogic(gameLogic),
      masterClient: { name: message.playerName || 'master', connection: socket },
      socketServer: server
    }

    const newGame = new Game(newGameRequest)
    rooms[newGame.pin] = newGame

    socket.emit(event.ROOMCREATED, { state: newGame.getGameState() })
  })
}

const RegisterJoinRoomEventOnSocket = (server: socketIO.Server, socket: socketIO.Socket) => {
  socket.on(event.JOINROOM, (message: { playerName: string, connectCode: string }) => {

    const gameRoom = rooms[message.connectCode]

    if (!gameRoom) {
      socket.emit(event.INDEXERROR, { reason: 'No room with this connectCode' })
      return
    }

    const player = {
      name: message.playerName,
      connection: socket
    }

    const joinRoomResponse = gameRoom.playerJoin(player)

    if (!joinRoomResponse.successful) {
      socket.emit(event.INDEXERROR, { reason: 'Player could not join this room' })
      return
    }

    socket.emit(event.ROOMJOINED, { state: gameRoom.getGameState() })
  })
}

export const RegisterServerEvents = (server: socketIO.Server) => {
  server.on('connection', (socket: socketIO.Socket) => {

    RegisterCreateRoomEventOnSocket(server, socket)
    RegisterJoinRoomEventOnSocket(server, socket)

  })
}
