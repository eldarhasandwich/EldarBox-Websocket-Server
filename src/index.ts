import * as fs from 'fs'
import * as http from 'http'

import express from 'express'
import socketIO from 'socket.io'

import config from './config'
import GameRoomList from './gameRoomList'
import { GameType, Game } from './game'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const roomList = new GameRoomList()

io.on('connection', (socket: socketIO.Socket) => {
  console.log('Socket Connection')

  socket.on('index-createRoom', (message: { gameTypeId: GameType }) => {

    console.log('attempting to create room', { message })

    const response = roomList.createGame(socket, io, message.gameTypeId)

    socket.emit('index-gameCreated', response)
  })

  socket.on('index-joinRoom', (message: { connectCode: string }) => {

    console.log('attempting to join room')

    if (!roomList.list[message.connectCode]) {
      socket.emit('error', { reason: 'No room with this connectCode' })
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
