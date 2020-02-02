
import * as WebSocket from 'websocket'

import { CreateServer } from '../../src/MasterServer/CreateServer'

import test from 'ava'

test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});