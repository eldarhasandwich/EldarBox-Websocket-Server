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

export class TickTackToe implements GameLogic<Message, State> {
  maxPlayers: number
  players: Player[]
  state: State

  constructor (players: Player[]) {
    this.maxPlayers = 2
    this.players = players
    this.state = {
      board: [
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ]
    }

    messageTypes.forEach((messageType) => {
      this.players.forEach((player) => {
        if (!player.playerRoomSocket) {
          return
        }

        player.playerRoomSocket.on(messageType, (message: Message) => {
          const newState = this.messageReducer(message)
          this.state = newState
        })
      })
    })
  }

  messageReducer (message: Message): State {
    switch (message.messageType) {
      case 'place':
        const newState: State = { board: [] }
        return newState

      default:
        return this.state
    }
  }
}
