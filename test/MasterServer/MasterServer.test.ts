
import test from 'ava'
import * as WebSocket from 'websocket'

import { CreateServer } from '../../src/MasterServer/CreateServer'

const port = 8080
const server = CreateServer(8080)
const masterClient = new WebSocket.w3cwebsocket(`ws://localhost:${port}`, 'echo-protocol')

test('foo', t => {
  t.pass()
})

test('bar', async t => {
  const bar = Promise.resolve('bar')
  t.is(await bar, 'bar')
})
