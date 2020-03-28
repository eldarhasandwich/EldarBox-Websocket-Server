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

export const DetectWinState = (board: BoardToken[][], token: BoardToken): BoardToken | undefined => {
  for (let i = 0; i < 2; i++) {
    if (board[i][0] === token && board[i][1] === token && board[i][2] === token) {
      return token
    }

    if (board[0][i] === token && board[1][i] === token && board[2][i] === token) {
      return token
    }
  }

  if (board[0][0] === token && board[1][1] === token && board[2][2] === token) {
    return token
  }

  if (board[0][2] === token && board[1][1] === token && board[2][0] === token) {
    return token
  }

  return undefined
}

export const HandlePlace = (gameObject: Game, currentState: State, message: PlaceCommand): State => {
  if (gameObject.players.length < 2) {
    return currentState
  }

  if (currentState.winner) {
    return currentState
  }

  const isCrossPlayer = gameObject.players[0].name === message.invokingPlayer
  const token = isCrossPlayer ? BoardToken.Cross : BoardToken.Naught

  if (currentState.nextToken !== token) {
    return currentState
  }

  const newBoard = currentState.board
  newBoard[message.position.x][message.position.y] = token

  const winState = DetectWinState(newBoard, token)

  return {
    ...currentState,
    nextToken: (token === BoardToken.Cross) ? BoardToken.Naught : BoardToken.Cross,
    board: newBoard,
    winner: winState
  }
}

const messageReducer = (gameObject: Game, currentState: State, message: PlaceCommand | NewGameCommand): State => {
  switch (message.messageType) {
    case 'place':
      return HandlePlace(gameObject, currentState, message)

    case 'newGame':
      return defaultState

    default:
      return currentState
  }
}

export const TickTackToe: GameLogic = {
  maxPlayers: 2,
  defaultState,
  messageReducer
}
