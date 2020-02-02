
const assert = require('assert');

import * as WebSocket from 'websocket'

import MasterServer from '../../src/MasterServer'

describe('Master Server', () => {
  describe('#CreateGame', () => {

    let outputMessage: string
    const MockWebsocketConnection = {
      send: (message: string) => { outputMessage = message }
    }



    it('fails to create a server with a nonexistent gameId', (done) => {
            
      done()
    })

    it('successfully creates a server when gameId is valid', (done) => {

      done()
    })
  })
})