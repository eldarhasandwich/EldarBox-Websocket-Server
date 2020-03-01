import { GameLogic } from './gameLogic'
import { Player } from '../player'

const messageTypes = [ 'place' ]

interface Message {
  messageType: 'place'
}

enum BoardToken {
  Empty = 0,
  Naught = 1,
  Cross = 2
}

interface State {
  board: BoardToken[][]
}

const defaultState = {
  board: [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
}

const messageReducer = (message: Message): State => {
  switch (message.messageType) {
    case 'place':
      const newState: State = { board: [] }
      return newState

    default:
      return TickTackToe.defaultState
  }
}

export const TickTackToe: GameLogic = {
  maxPlayers: 2,
  defaultState,
  messageReducer
}
