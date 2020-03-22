import { GameLogic } from './gameLogic'

import { Game } from '../game'

interface PlaceCommand {
  messageType: 'place',
  invokingPlayer: string
  position: {
    x: 0 | 1 | 2,
    y: 0 | 1 | 2
  }
}

interface NewGameCommand {
  messageType: 'newGame'
}

enum BoardToken {
  Empty = 0,
  Naught = 1,
  Cross = 2
}

interface State {
  nextToken: BoardToken
  board: BoardToken[][]
}

const defaultState: State = {
  nextToken: BoardToken.Naught,
  board: [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
}

const HandlePlace = (gameObject: Game, currentState: State, message: PlaceCommand): State => {
  if (gameObject.players.length > 2) {
    return currentState
  }

  const isCrossPlayer = gameObject.players[0].name === message.invokingPlayer
  const token = isCrossPlayer ? BoardToken.Cross : BoardToken.Naught

  if (currentState.nextToken !== token) {
    return currentState
  }

  const newBoard = currentState.board
  newBoard[message.position.x][message.position.y] = token

  return {
    ...currentState,
    nextToken: (token === BoardToken.Cross) ? BoardToken.Naught : BoardToken.Cross,
    board: newBoard
  }
}

const messageReducer = (gameObject: Game, currentState: State, message: PlaceCommand | NewGameCommand): State => {
  switch (message.messageType) {
    case 'place':
      return HandlePlace(gameObject, currentState, message)

    case 'newGame':
      return {
        ...currentState,
        nextToken: defaultState.nextToken,
        board: defaultState.board
      }

    default:
      return currentState
  }
}

export const TickTackToe: GameLogic = {
  maxPlayers: 2,
  defaultState,
  messageReducer
}
