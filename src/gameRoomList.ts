
import socketIO from 'socket.io'

import { Player } from './player'
import { 
  Game, 
} from './game'
import { GameLogic } from './logic/gameLogic'

export interface NewGameRequest {
  name: string,
  gameType: GameType,
  gameLogic: GameLogic<any, any>,
  master: Player,
  socketServer: socketIO.Server
}

export enum GameType {
  ticktacktoe = 0
}

class GameRoomList {

  list: { [connectCode: string]: Game }

  constructor() {
    this.list = {}
  }

  createGame = (request: NewGameRequest): Game => {    
    const newGame = new Game(request)
    const connectCode = newGame.pin
    
    this.list[connectCode] = newGame

    return newGame
  }

  joinGame = (guestName: string, guestSocket: socketIO.Socket) => {
    
  }
}

export default GameRoomList