import { Game } from '../Classes/Game'

import { TickTackToe } from './TickTackToe'

export enum GameType {
  ticktacktoe = 0
}

export interface GameRules {
  maxPlayers: number,
  messageReducer: (game: Game, currentState: any, message: any) => any
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
  messageReducer: (game: Game, currentState: any, message: any) => any

  constructor (ruleSet: GameRules) {
    this.maxPlayers = ruleSet.maxPlayers
    this.state = JSON.parse(JSON.stringify(ruleSet.defaultState)) // just in case shh
    this.messageReducer = ruleSet.messageReducer
  }
}
