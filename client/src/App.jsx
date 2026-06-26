import { useContext } from 'react'
import Login from './Components/Pages/Login'
import FriendsContext from './Store/Context/FriendsContext'
import PresenceContext from './Store/Context/PresenceContext'
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
            <PresenceContext>
              <BackDropContext>
                <BackDropHandler />
              </BackDropContext>
            </PresenceContext>
          </FriendsContext>
          :
          <Login />
      }
    </>
  )
}

export default App
