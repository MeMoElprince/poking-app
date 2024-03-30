import { useEffect, useState } from 'react'
import Root from './Components/Root'
import Loading from './Components/Loading'
import FriendsContext from './Store/FriendsContext'
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const handleWebsiteLoad = ()=>{
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    window.addEventListener('load',handleWebsiteLoad)
    return ()=>{
      window.removeEventListener('load',handleWebsiteLoad)
    }
  },[])
  return (
    <FriendsContext>
      {loading && <Loading />}
      {!loading && <Root />}
    </FriendsContext>
  )
}

export default App
