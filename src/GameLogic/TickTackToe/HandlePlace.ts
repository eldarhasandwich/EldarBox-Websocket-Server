import { Game } from '../../Classes/Game'
import {
  PlaceCommand,
  BoardToken,
  State
} from '.'

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

const HandlePlace = (game: Game, currentState: State, message: PlaceCommand): State => {

  if (game.players.length < 2) {
    return currentState
  }

  if (currentState.winner) {
    return currentState
  }

  const isCrossPlayer = game.players[0].name === message.invokingPlayer
  const token = isCrossPlayer ? BoardToken.Cross : BoardToken.Naught

  if (currentState.nextToken !== token) {
    return currentState
  }

  const newBoard = currentState.board
  if (newBoard[message.position.x][message.position.y] !== BoardToken.Empty) {
    return currentState
  }

  newBoard[message.position.x][message.position.y] = token

  const winState = DetectWinState(newBoard, token)

  return {
    ...currentState,
    nextToken: (token === BoardToken.Cross) ? BoardToken.Naught : BoardToken.Cross,
    board: newBoard,
    winner: winState
  }
}

export default HandlePlace
