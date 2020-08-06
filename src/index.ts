import * as http from 'http'

import express from 'express'
import socketIO from 'socket.io'

import config from './config'
import { RegisterServerEvents } from './ServerEvents'

const app = express()
const httpServer = http.createServer(app)
const socketIoServer = socketIO(httpServer)

RegisterServerEvents(socketIoServer)

httpServer.on('error', (err) => {
  throw err
})

httpServer.on('listening', () => {
  console.log(`Listening on port ${config.port}`)
})

httpServer.listen(config.port)
