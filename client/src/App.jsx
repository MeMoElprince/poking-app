import { useContext } from 'react'
import Login from './Components/Pages/Login'
import FriendsContext from './Store/Context/FriendsContext'
import { UserCtx } from './Store/Context/UserContext'
import BackDropHandler from './Components/BackDropHandler'
import BackDropContext from './Store/Context/BackDropContext'

function App() {
  const { LogedIn } = useContext(UserCtx);
  
  return (
    <>
      {
        LogedIn ?
          <FriendsContext>
            <BackDropContext>
              <BackDropHandler />
            </BackDropContext>
          </FriendsContext>
          :
          <Login />
      }
    </>
  )
}

export default App
