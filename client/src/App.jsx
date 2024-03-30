import Root from './Components/Root'
import FreindsContext from './Store/FreindsContext'
function App() {
  return (
    <FreindsContext>
      <Root />
    </FreindsContext>
  )
}

export default App
