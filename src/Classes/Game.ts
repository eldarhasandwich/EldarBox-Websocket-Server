import * as crypto from 'crypto'
import socketIO from 'socket.io'

import { GameLogic, GameType } from '../GameLogic'
import * as event from '../config/EventNames'

import { Player } from './Player'

export interface NewGameRequest {
  name: string,
  gameType: GameType,
  gameLogic: GameLogic,
  masterClient: Player,
  socketServer: socketIO.Server
}

export class Game {
  name: string
  type: GameType
  gameLogic: GameLogic
  socketServer: socketIO.Server

  masterClient: Player
  players: Player[]
  pin: string

  constructor (request: NewGameRequest) {
    this.name = request.name
    this.type = request.gameType
    this.gameLogic = request.gameLogic
    this.socketServer = request.socketServer
    this.masterClient = request.masterClient
    this.players = []

    this.pin = crypto.randomBytes(2).toString('hex')
    this.masterClient.playerRoomSocket = this.masterClient.connection.join(this.getRoomId())

    this.masterClient.connection.on(event.DISCONNECT, () => {
      this.endGame()
    })
  }

  getRoomId (): string {
    return `room ${this.pin}`
  }

  getGameState (): any {
    return {
      name: this.name,
      type: this.type,
      state: this.gameLogic.state,
      players: this.players.map(p => { return { name: p.name } }),
      pin: this.pin
    }
  }

  playerJoin (player: Player): { successful: boolean } {
    if (this.players.length >= this.gameLogic.maxPlayers) {
      return { successful: false }
    }

    const nameCollision = this.players.find(existingPlayer => existingPlayer.name === player.name)
    if (nameCollision) {
      return { successful: false }
    }

    this.players.push(player)
    player.playerRoomSocket = player.connection.join(this.getRoomId())

    player.connection.on(event.GAMECOMMAND, (command: any) => {
      const newState = this.gameLogic.messageReducer(this, this.gameLogic.state, command)
      this.gameLogic.state = newState

      this.socketServer
        .to(this.getRoomId())
        .emit(event.STATEUPDATE, { state: this.getGameState() })
    })

    this.socketServer
      .to(this.getRoomId())
      .emit(event.STATEUPDATE, { state: this.getGameState() })

    return { successful: true }
  }

  endGame (): void {
    for (const player of this.players) {
      player.connection.emit(event.DISCONNECT)
    }
  }
}
