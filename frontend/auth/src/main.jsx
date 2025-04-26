// This is the entry point of your React application. this can be of js or jsx format
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" richColors closeButton />
    <App />
  </StrictMode>,
)
