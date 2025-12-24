import './index.css'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/authContext";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
        <App />
    </AuthProvider>
  </BrowserRouter>,
)
