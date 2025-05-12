import { useState } from 'react'
import Navbar from './components/nav'
import Search from './components/searchBar'
import TeamDisplay from './components/TeamDisplay'
import TeamProvider from './context/team'

function App() {
  return (
    <TeamProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <h1 className="title">Pokémon Team Builder</h1>
          <Search />
          <TeamDisplay />
        </div>
      </div>
    </TeamProvider>
  )
}

export default App
