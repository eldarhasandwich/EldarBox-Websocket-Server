import { GameRules } from '..'

import { Game } from '../../Classes/Game'

import HandlePlace from './HandlePlace'

enum Commands {
  PLACE = 'place',
  NEWGAME = 'newGame'
}

export interface PlaceCommand {
  messageType: Commands.PLACE,
  invokingPlayer: string
  position: {
    x: 0 | 1 | 2,
    y: 0 | 1 | 2
  }
}

interface NewGameCommand {
  messageType: Commands.NEWGAME
}

export enum BoardToken {
  Empty = 0,
  Naught = 1,
  Cross = 2
}

export interface State {
  nextToken: BoardToken
  winner: undefined | BoardToken
  board: BoardToken[][]
}

const defaultState: State = {
  nextToken: BoardToken.Naught,
  winner: undefined,
  board: [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
}

const messageReducer = (game: Game, currentState: State, message: PlaceCommand | NewGameCommand, invokingPlayer: number): State => {
  switch (message.messageType) {
    case Commands.PLACE:
      return HandlePlace(game, currentState, message)

    case Commands.NEWGAME:
      return JSON.parse(JSON.stringify(defaultState))

    default:
      return currentState
  }
}

const TickTackToe: GameRules = {
  maxPlayers: 2,
  defaultState,
  messageReducer
}

export default TickTackToe
