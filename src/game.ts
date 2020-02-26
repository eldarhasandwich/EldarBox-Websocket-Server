import * as crypto from 'crypto'

import * as T from 'tswrap'
import socketIO from 'socket.io'

import { 
  NewGameRequest,
  GameType 
} from './gameRoomList'
import { GameLogic } from './logic/gameLogic'

import { Player } from './player'

export class Game {
  name: string
  type: GameType
  gameLogic: GameLogic<any, any>
  socketServer: socketIO.Server

  master: Player
  players: Player[]
  pin: string

  constructor (request: NewGameRequest) {
    this.name = request.name
    this.type = request.gameType
    this.gameLogic = request.gameLogic

    this.socketServer = request.socketServer

    this.master = request.master
    this.players = []

    this.pin = crypto.randomBytes(4).toString('hex')

    this.master.playerRoomSocket = this.master.connection.join(this.getRoomId())
  }

  getRoomId (): string {
    return `room ${this.pin}`
  }

  join (player: Player): boolean {
    // TODO: check if player can actually join
    this.players.push(player)
    const playerRoomSocket = player.connection.join(this.getRoomId())

    player.playerRoomSocket = playerRoomSocket

    return true
  }

  start (): void {
    this.socketServer.to(this.getRoomId()).emit('game-start')
  }

  end (): void {
    for (const player of this.players) {
      player.connection.emit('disconnect')
    }
  }
}
