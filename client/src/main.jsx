import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserAuthContext from './Store/Context/UserAuthContext.jsx'
import { Analytics } from "@vercel/analytics/react"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserAuthContext>
    <App />
    <ToastContainer />
    <Analytics />
  </UserAuthContext>
)
