import socketIO from 'socket.io'

export interface NewPlayerRequest {
  name: string,
  connection: socketIO.Socket,
  playerRoomSocket?: socketIO.Socket
}

export class Player {
  name: string
  connection: socketIO.Socket
  playerRoomSocket?: socketIO.Socket

  constructor (newPlayerRequest: NewPlayerRequest) {
    this.name = newPlayerRequest.name
    this.connection = newPlayerRequest.connection
    this.playerRoomSocket = newPlayerRequest.playerRoomSocket
  }
}
