import { GameType } from '../game'

import { TickTackToe } from './ticktacktoe'

export interface GameLogic {
  maxPlayers: number,
  messageReducer: (currentState: any, message: any) => any
  defaultState: any
}

export const RetrieveGameLogic = (gameType: GameType): GameLogic | undefined => {
  switch (gameType) {
    case GameType.ticktacktoe:
      return TickTackToe

    default:
      return undefined
  }
}

export class GameLogicInstance {
  maxPlayers: number
  state: any
  messageReducer: (currentState: any, message: any) => any

  constructor (gameLogic: GameLogic) {
    this.maxPlayers = gameLogic.maxPlayers,
    this.state = JSON.parse(JSON.stringify(gameLogic.defaultState)), // just in case shh
    this.messageReducer = gameLogic.messageReducer
  }
}
