import { Game } from '../Classes/Game'

import TickTackToe from './TickTackToe'

export enum GameType {
  ticktacktoe = 0
}

type MessageReducer = (game: Game, currentState: any, message: any, invokingPlayer: number) => any

export interface GameRules {
  maxPlayers: number,
  messageReducer: MessageReducer
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
  messageReducer: MessageReducer

  constructor (ruleSet: GameRules) {
    this.maxPlayers = ruleSet.maxPlayers
    this.state = JSON.parse(JSON.stringify(ruleSet.defaultState)) // just in case shh
    this.messageReducer = ruleSet.messageReducer
  }
}
