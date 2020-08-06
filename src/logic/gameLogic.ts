import { Game, GameType } from '../Game'

import { TickTackToe } from './ticktacktoe'

export interface GameRules {
  maxPlayers: number,
  messageReducer: (gameObject: Game, currentState: any, message: any) => any
  defaultState: any
}

export const RetrieveGameLogic = (gameType: GameType): GameRules | undefined => {
  switch (gameType) {
    case GameType.ticktacktoe:
      return TickTackToe

    default:
      return undefined
  }
}

export class GameLogic {
  maxPlayers: number
  state: any
  messageReducer: (gameObject: Game, currentState: any, message: any) => any

  constructor (gameLogic: GameRules) {
    this.maxPlayers = gameLogic.maxPlayers
    this.state = JSON.parse(JSON.stringify(gameLogic.defaultState)) // just in case shh
    this.messageReducer = gameLogic.messageReducer
  }
}
