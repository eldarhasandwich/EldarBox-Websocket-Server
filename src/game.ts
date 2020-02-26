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

  join (player: Player): { successful: boolean } {
    if (this.players.length >= this.gameLogic.maxPlayers) {
      return { successful: false }
    }

    const nameCollision = this.players.find(existingPlayer => existingPlayer.name === player.name)
    if (nameCollision) {
      return { successful: false }
    }

    this.players.push(player)
    player.playerRoomSocket = player.connection.join(this.getRoomId())

    // apply gamelogic to player socket!

    return { successful: true }
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
