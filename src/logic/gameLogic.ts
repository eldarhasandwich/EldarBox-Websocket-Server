import { Player } from '../player'

export interface GameLogic<Message, State> {
  maxPlayers: number,
  players: Player[],
  messageReducer: (message: Message) => State
  state: State
}
