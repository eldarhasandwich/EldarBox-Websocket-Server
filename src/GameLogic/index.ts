import { Game } from '../Classes/Game'

import TickTackToe from './TickTackToe'

type MessageReducer = (game: Game, currentState: any, message: any, invokingPlayer: number) => any

export enum GameType {
  ticktacktoe = 'ticktacktoe'
}

export interface GameRules {
  maxPlayers: number,
  messageReducer: MessageReducer
  defaultState: any
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

const RULESETS = {
  ticktacktoe: TickTackToe
}

export const RetrieveGameLogic = (gameType: GameType): GameRules | undefined => {
  return RULESETS[gameType]
}
