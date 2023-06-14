// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState({key, value = {}}) {
  const initialiseLocalStorage = () => {
    const localStorageValue = window.localStorage.getItem(key)

    if (localStorageValue) {
      try {
        return JSON.parse(localStorageValue)
      } catch (e) {
        window.localStorage.removeItem(key)
      }
    }
  }

  const [state, setState] = React.useState(initialiseLocalStorage)

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState({key: 'name', name: initialName})

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
