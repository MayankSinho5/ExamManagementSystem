import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = (msg, url, line, col, error) => {
  alert(`Error: ${msg}\nAt: ${url}:${line}:${col}`);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
