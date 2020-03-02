import { GameLogic } from './gameLogic'
// import { Player } from '../player'

interface PlaceCommand {
  messageType: 'place',
  token: BoardToken,
  position: {
    x: 0 | 1 | 2,
    y: 0 | 1 | 2
  }
}

enum BoardToken {
  Empty = 0,
  Naught = 1,
  Cross = 2
}

interface State {
  board: BoardToken[][]
}

const defaultState: State = {
  board: [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
}

const messageReducer = (currentState: State, message: PlaceCommand): State => {
  switch (message.messageType) {
    case 'place':
      const newBoard = currentState.board
      newBoard[message.position.x][message.position.y] = message.token

      const newState: State = {
        ...currentState,
        board: newBoard
      }
      return newState

    default:
      return currentState
  }
}

export const TickTackToe: GameLogic = {
  maxPlayers: 2,
  defaultState,
  messageReducer
}
