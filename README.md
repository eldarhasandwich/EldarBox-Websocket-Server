# Websocket Server


## WS server lifecycle

- A websocket server is created. 
- A request listener is associated with this server. 
- The connection of a request has a message listener associated.
- Inside this message listener, we define business logic of the game  

## Master Client 

A master game client should create to a game with the given request;
```js
socket.emit('index-createRoom', {
  gameTypeId: 0 // number
})
```

Subscribing to `index-gameCreated` will tell you if request was successful.
```js
socket.on('index-gameCreated', (message) => {
  const { gameState } = message
})
```

Subscribing to `index-error` will let you handle errors in this request;
```js
socket.on('index-error', (message) => {
  const { reason } = message
})
```

## Guest Client

A guest game client should connect to an existing game using the given request;
```js
socket.emit('index-joinRoom', {
  playerName: 'eldar', // string
  connectCode: '1234' // string
})
```

Subscribing to `index-gameJoined` will tell you if request was successful.
```js
socket.on('index-error', (message) => {
  const { reason } = message
})
```

You should also subscribe to `index-error` to handle errors in this case, same as master client.

Guests send requests to the game using `gameCommand`;
```js
socket.emit('gameCommand', { // totally specific to gametype
  action: 'do something',
  somethingElse: [2,3],
  ... 
})
```

## Game Updates

Master, guest game clients should subscribe to the following event to handle server authoritative game updates;
```js
socket.on('gameUpdate', (message) => {
  const { gameState } = message

  appGameState = gameState // application specific logic
})
```