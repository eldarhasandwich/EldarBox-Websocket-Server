
import test from 'ava'

import { DetectWinState } from '../ticktacktoe'

test('DetectWinState detects a valid win state', t => {
  const board1 = [
    [1,1,1],
    [0,0,0],
    [0,0,0]
  ]

  t.is(
    DetectWinState(board1, 1),
    1
  )

  const board2 = [
    [1,0,0],
    [0,1,0],
    [0,0,1]
  ]

  t.is(
    DetectWinState(board2, 1),
    1
  )

  const board3 = [
    [0,1,0],
    [0,1,0],
    [0,1,0]
  ]

  t.is(
    DetectWinState(board3, 1),
    1
  )
})

test('DetectWinState returns undefined with a non-win state', t => {
  const board1 = [
    [1,1,0],
    [0,1,0],
    [1,0,0]
  ]

  t.is(
    DetectWinState(board1, 1),
    undefined
  )
})
