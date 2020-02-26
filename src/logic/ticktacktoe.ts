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

export const TickTackToe: GameLogic<Message, State> = {
  maxPlayers: 2,
  players: [],
  state: {
    board: [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ]
  },
  messageReducer: (message: Message): State => {
    switch (message.messageType) {
      case 'place':
        const newState: State = { board: [] }
        return newState

      default:
        return TickTackToe.state
    }
  }
}
