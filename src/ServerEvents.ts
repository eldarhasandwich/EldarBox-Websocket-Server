import socketIO from 'socket.io'

import * as e from './config/eventNames'
import { RetrieveGameLogic, GameLogic } from './logic/GameLogic'
import { Game, GameType } from './Game'

const rooms: { [connectCode: string]: Game } = {}

const RegisterCreateRoomEventOnSocket = (server: socketIO.Server, socket: socketIO.Socket) => {
  socket.on(e.CREATEROOM, (message: { gameTypeId: GameType }) => {

    const gameLogic = RetrieveGameLogic(message.gameTypeId)
    if (!gameLogic) {
      socket.emit(e.INDEXERROR, { reason: 'No game of this type' })
      return
    }

    const newGameRequest = {
      name: 'a game',
      gameType: message.gameTypeId,
      gameLogic: new GameLogic(gameLogic),
      masterClient: { name: 'master', connection: socket },
      socketServer: server
    }

    const newGame = new Game(newGameRequest)
    rooms[newGame.pin] = newGame

    socket.emit(e.ROOMCREATED, { gameObject: newGame.getGamestate() })
  })
}

const RegisterJoinRoomEventOnSocket = (server: socketIO.Server, socket: socketIO.Socket) => {
  socket.on(e.JOINROOM, (message: { playerName: string, connectCode: string }) => {

    const gameRoom = rooms[message.connectCode]

    if (!gameRoom) {
      socket.emit(e.INDEXERROR, { reason: 'No room with this connectCode' })
      return
    }

    const player = {
      name: message.playerName,
      connection: socket
    }

    const response = gameRoom.join(player)

    if (!response.successful) {
      socket.emit(e.INDEXERROR, { reason: 'Player could not join this room' })
      return
    }

    socket.emit(e.ROOMJOINED, { gameObject: gameRoom.getGamestate() })
  })
}

export const RegisterServerEvents = (server: socketIO.Server) => {
  server.on('connection', (socket: socketIO.Socket) => {

    RegisterCreateRoomEventOnSocket(server, socket)
    RegisterJoinRoomEventOnSocket(server, socket)

  })
}
