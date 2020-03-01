import * as fs from 'fs'
import * as http from 'http'

import express from 'express'
import socketIO from 'socket.io'

import config from './config'
import { Game, GameType } from './game'
import {
  RetrieveGameLogic,
  GameLogicInstance
} from './logic/gameLogic'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const roomList: { [connectCode: string]: Game } = {}

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
      name: 'a game',
      gameType: message.gameTypeId,
      gameLogic: new GameLogicInstance(gameLogic),
      master,
      socketServer: io
    }

    const newGame = new Game(newGameRequest)
    roomList[newGame.pin] = newGame

    socket.emit('index-gameCreated', { gameObject: newGame.getGamestate() })
  })

  socket.on('index-joinRoom', (message: { playerName: string, connectCode: string }) => {

    console.log('attempting to join room')

    const gameRoom = roomList[message.connectCode]

    if (!gameRoom) {
      socket.emit('index-error', { reason: 'No room with this connectCode' })
      return
    }

    console.log('found room', { gameRoom })

    const player = {
      name: message.playerName,
      connection: socket
    }

    const response = gameRoom.join(player)

    console.log('join response', { response })

    if (!response.successful) {
      socket.emit('index-error', { reason: 'Player could not join this room' })
      return
    }

    socket.emit('index-gameJoined', { gameObject: gameRoom.getGamestate() })
  })
})

server.on('error', (err) => {
  throw err
})

server.on('listening', () => {
  console.log(`Listening on port ${config.port}`)
})

server.listen(config.port)
