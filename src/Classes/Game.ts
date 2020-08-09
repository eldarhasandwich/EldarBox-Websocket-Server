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

  roomOwner: Player
  playerClients: Player[]
  pin: string

  constructor (request: NewGameRequest) {
    this.name = request.name
    this.type = request.gameType
    this.gameLogic = request.gameLogic
    this.socketServer = request.socketServer
    this.roomOwner = request.masterClient
    this.playerClients = []

    this.pin = crypto.randomBytes(2).toString('hex')
    this.roomOwner.playerRoomSocket = this.roomOwner.connection.join(this.getRoomId())

    this.roomOwner.connection.on(event.DISCONNECT, () => {
      this.dropGuests()
    })

    this.playerJoin(this.roomOwner)
  }

  getRoomId (): string {
    return `room ${this.pin}`
  }

  getGameState (): any {
    return {
      name: this.name,
      type: this.type,
      state: this.gameLogic.state,
      players: this.playerClients.map(p => { return { name: p.name } }),
      pin: this.pin
    }
  }

  playerJoin (player: Player): { successful: boolean } {
    if (this.playerClients.length >= this.gameLogic.maxPlayers) {
      return { successful: false }
    }

    const nameCollision = this.playerClients.find(existingPlayer => existingPlayer.name === player.name)
    if (nameCollision) {
      return { successful: false }
    }

    const playerIndex = this.playerClients.push(player) - 1
    player.playerRoomSocket = player.connection.join(this.getRoomId())

    player.connection.on(event.GAMECOMMAND, (command: any) => {
      const newState = this.gameLogic.messageReducer(this, this.gameLogic.state, command, playerIndex)
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

  dropGuests (): void {
    this.playerClients
      .filter(p => p !== this.roomOwner)
      .forEach(p => {
        p.connection.emit(event.DISCONNECT)
      })
  }
}
