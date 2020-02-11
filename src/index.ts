import * as fs from 'fs'
import * as http from 'http'

import express from 'express'
import socketIO from 'socket.io'

import config from './config'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', (socket: socketIO.Socket) => {
  socket.emit('blah', { ok: 'blah' })
})

server.on('error', (err) => {
  throw err
})

server.on('listening', () => {
  console.log(`Listening on port ${config.port}`)
})

server.listen(config.port)
