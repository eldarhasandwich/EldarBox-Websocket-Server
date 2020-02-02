
import * as WebSocket from 'websocket'

const assert = require('assert');
import { CreateServer } from '../../src/MasterServer/CreateServer'

describe('Master Server', () => {
  describe('#CreateGame', () => {

    const port = 8080 
    const server = CreateServer(8080)
    const masterClient = new WebSocket.w3cwebsocket(`ws://localhost:${port}`, 'echo-protocol')
    
    it('fails to create a server with a nonexistent gameId', (done) => {
            
      done()
    })

    it('successfully creates a server when gameId is valid', (done) => {

      done()
    })
  })
})