import { Player } from '../player'

export interface GameLogic<MessageType, StateType> {
  maxPlayers: number,
  players: Player[],
  messageReducer: (message: MessageType) => StateType
  state: StateType
}
