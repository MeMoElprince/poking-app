import { useEffect, useState, useContext } from 'react'
import LoadingPage from './Components/Pages/LoadingPage'
import Login from './Components/Pages/Login'
import FriendsContext from './Store/Context/FriendsContext'
import { UserAuthCtx } from './Store/Context/UserAuthContext'
import BackDropHandler from './Components/BackDropHandler'
import BackDropContext from './Store/Context/BackDropContext'

function App() {
  const { LogedIn } = useContext(UserAuthCtx);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleWebsiteLoad = () => {
      setLoading(false);
    }
    window.addEventListener('load', handleWebsiteLoad)
    return () => {
      window.removeEventListener('load', handleWebsiteLoad)
    }
  }, [])
  return (
    <>
      {loading ?
        <LoadingPage />
        :
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
