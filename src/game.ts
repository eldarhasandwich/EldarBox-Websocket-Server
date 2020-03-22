import * as crypto from 'crypto'

import * as T from 'tswrap'
import socketIO from 'socket.io'

import { GameLogicInstance } from './logic/gameLogic'

import { Player } from './player'

export enum GameType {
  ticktacktoe = 0
}

export interface NewGameRequest {
  name: string,
  gameType: GameType,
  gameLogic: GameLogicInstance,
  master: Player,
  socketServer: socketIO.Server
}

export class Game {
  name: string
  type: GameType
  gameLogic: GameLogicInstance
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

    this.master.connection.on('disconnect', () => {
      this.endGame()
    })
  }

  getRoomId (): string {
    return `room ${this.pin}`
  }

  getGamestate (): any {
    return {
      name: this.name,
      type: this.type,
      state: this.gameLogic.state,
      players: this.players.map(p => { return { name: p.name } }),
      pin: this.pin
    }
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
    player.connection.on('gameCommand', (command: any) => {
      const newState = this.gameLogic.messageReducer(this, this.gameLogic.state, command)
      this.gameLogic.state = newState

      this.socketServer
        .to(this.getRoomId())
        .emit('stateUpdate', { state: this.getGamestate() })
    })

    this.socketServer
      .to(this.getRoomId())
      .emit('stateUpdate', { state: this.getGamestate() })

    return { successful: true }
  }

  startGame (): void {
    this.socketServer.to(this.getRoomId()).emit('game-start', { ok: 'ok' })
  }

  endGame (): void {
    for (const player of this.players) {
      player.connection.emit('disconnect')
    }
  }
}
