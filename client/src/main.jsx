import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import FirstPage from './FirstPage.jsx'
import Calculator from './calculator/Calculator.jsx'
import './index.css'
import UserContext from './Store/Context/UserContext.jsx'
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContext>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/PokingApp" element={<App />} />
        <Route path="/Calculator" element={<Calculator />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
    <Analytics />
  </UserContext>
)
