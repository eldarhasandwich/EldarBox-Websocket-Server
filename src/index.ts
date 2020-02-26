import * as fs from 'fs'
import * as http from 'http'

import express from 'express'
import socketIO from 'socket.io'

import config from './config'
import GameRoomList, { GameType } from './gameRoomList'
// import { Game } from './game'
import { RetrieveGameLogic } from './logic/gameLogic'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const roomList = new GameRoomList()

io.on('connection', (socket: socketIO.Socket) => {
  console.log('Socket Connection')

  socket.on('index-createRoom', (message: { gameTypeId: GameType }) => {

    console.log('attempting to create room', { message })

    const master = {
      name: 'room master',
      connection: socket
    }

    const gameLogic = RetrieveGameLogic(message.gameTypeId)
    if (!gameLogic) {
      socket.emit('index-error', { reason: 'No game of this type' })
      return
    }

    const newGameRequest = {
      name: 'yeet',
      gameType: message.gameTypeId,
      gameLogic,
      master,
      socketServer: io
    }

    const newGame = roomList.createGame(newGameRequest)

    socket.emit('index-gameCreated', { connectCode: newGame.pin })
  })

  socket.on('index-joinRoom', (message: { connectCode: string }) => {

    console.log('attempting to join room')

    if (!roomList.list[message.connectCode]) {
      socket.emit('index-error', { reason: 'No room with this connectCode' })
    }


  })
})

server.on('error', (err) => {
  throw err
})

server.on('listening', () => {
  console.log(`Listening on port ${config.port}`)
})

server.listen(config.port)
