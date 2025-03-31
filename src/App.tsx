import "./App.css"
import { FieldView } from "./components/FieldView"
import { Scoreboard } from "./components/Scoreboard"
import { Sidebar } from "./components/Sidebar"
import { GameStateBanner } from "./components/GameStateBanner"

function App() {
  return (
    <div className="App">
      <main>
        <div className="container">
          <div className="Scoreboard">
            <Scoreboard />
            <GameStateBanner />
          </div>
          <div className="field-wrapper">
            <FieldView />
          </div>
        </div>
        <aside className="sidebar">
          <Sidebar />
        </aside>
      </main>
    </div>
  )
}

export default App
