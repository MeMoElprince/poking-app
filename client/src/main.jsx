import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserAuthContext from './Store/UserAuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContext>
      <App />
    </UserAuthContext>
  </React.StrictMode>,
)
