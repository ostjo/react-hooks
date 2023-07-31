// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const emptyBoard = Array(9).fill(null)
  const [currentStep, setCurrentStep] = useLocalStorageState('step', 0)
  const [moves, setMoves] = useLocalStorageState('moves', [emptyBoard])

  const nextValue = calculateNextValue(moves[currentStep])
  const winner = calculateWinner(moves[currentStep])
  const status = calculateStatus(winner, moves[currentStep], nextValue)

  function selectSquare(square) {
    if (moves[currentStep][square] != null || winner != null) return
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    const squaresCopy = [...moves[currentStep]]
    const movesCopy = moves.slice(0, currentStep + 1)
    // 🐨 set the value of the square that was selected
    squaresCopy[square] = nextValue

    setCurrentStep(step => step + 1)
    setMoves([...movesCopy, squaresCopy])
  }

  function restart() {
    setCurrentStep(0)
    setMoves([emptyBoard])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={moves[currentStep]} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          moves={moves}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  )
}

function Moves({moves, currentStep, setCurrentStep}) {
  function selectMove(move) {
    setCurrentStep(move)
  }

  function renderButton(move, index) {
    const firstMove = index === 0

    return (
      <li key={move + index}>
        <button
          disabled={firstMove && index === currentStep}
          onClick={() => selectMove(index)}
        >
          {firstMove ? `Go to game start` : `Go to move #${index}`}
          {currentStep === index && ' (current)'}
        </button>
      </li>
    )
  }

  return <ol>{moves.map((move, index) => renderButton(move, index))}</ol>
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
