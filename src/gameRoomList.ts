
import socketIO from 'socket.io'

import { Player } from './player'
import { 
  Game, 
  GameType
} from './game'

class GameRoomList {

  list: { [connectCode: string]: Game }

  constructor() {
    this.list = {}
  }

  createGame = (masterSocket: socketIO.Socket, socketServer: socketIO.Server, gameType: GameType): { connectCode: string } => {
    const master = {
      name: 'room master',
      connection: masterSocket
    }

    const newGameRequest = {
      name: 'a game',
      type: GameType.ticktacktoe,
      master,
      socketServer
    }
    
    const g = new Game(newGameRequest)
    const connectCode = g.pin
    
    this.list[connectCode] = g

    return {
      connectCode
    }
  }

  joinGame = (guestSocket: socketIO.Socket) => {
    
  }
}

export default GameRoomList