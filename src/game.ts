import * as crypto from 'crypto'

import * as T from 'tswrap'
import socketIO from 'socket.io'

import { Player } from './player'

export enum GameType {
  ticktacktoe = 0
}

interface NewGameRequest {
  name: string,
  type: GameType,
  master: Player,
  socketServer: socketIO.Server
}

export class Game {
  name: string
  type: GameType
  socketServer: socketIO.Server

  master: Player
  players: Player[]
  pin: string

  constructor (request: NewGameRequest) {
    this.name = request.name
    this.type = request.type

    this.socketServer = request.socketServer

    this.master = request.master
    this.players = []

    this.pin = crypto.randomBytes(4).toString('hex')
  }

  join (player: Player): boolean {
    // TODO: check if player can actually join
    this.players.push(player)
    const playerRoomSocket = player.connection.join(`room ${this.pin}`)

    player.playerRoomSocket = playerRoomSocket

    return true
  }

  start (): void {
    this.socketServer.to(`room ${this.pin}`).emit('start')
  }

  end (): void {
    for (const player of this.players) {
      player.connection.emit('disconnect')
    }
  }
}
