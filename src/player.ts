import socketIO from 'socket.io'

export interface Player {
  name: string,
  connection: socketIO.Socket,
  playerRoomSocket?: socketIO.Socket
}
