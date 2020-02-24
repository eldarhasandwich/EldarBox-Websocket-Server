
import { GameLogic } from './logic/gameLogic'
import { Player } from './player'

interface GameRoom<m, s> {
  connectCode: string
  gameLogic: GameLogic<m, s> | undefined
}

const GameRoomList: { [connectCode: string]: GameRoom<unknown, unknown> } = {}

export default GameRoomList