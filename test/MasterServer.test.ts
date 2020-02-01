
// cant use connect?
const assert = require('assert');

import * as WebSocket from 'websocket'

import { CreateServer } from '../src/MasterServer'

describe('master server', () => {
  describe('#CreateServer', () => {

    let outputMessage: string
    const MockWebsocketConnection = {
      send: (message: string) => { outputMessage = message }
    }

    it('fails to create a server with a nonexistent gameId', (done) => {
      outputMessage = 'none'

      CreateServer(MockWebsocketConnection as WebSocket.connection, 'bad-game-id')
      assert(outputMessage, 'xyz')
            
      done()
    })

    it('successfully creates a server when gameId is valid', (done) => {
      outputMessage = 'none'

      // GuestConnect

      done()
    })
  })
})