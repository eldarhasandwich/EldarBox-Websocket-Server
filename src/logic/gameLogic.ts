import { Player } from '../player'
import { GameType } from '../gameRoomList'

import { TickTackToe } from './ticktacktoe'

export interface GameLogic<Message, State> {
  maxPlayers: number,
  players: Player[],
  messageReducer: (message: Message) => State
  state: State
}

export const RetrieveGameLogic = (gameType: GameType): GameLogic<any, any> | undefined => {
  switch(gameType) {
    case GameType.ticktacktoe:
      return TickTackToe

    default:
      return undefined
  }
}