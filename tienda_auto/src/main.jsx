import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
 
 <StrictMode>

      <BrowserRouter>
          <CartProvider>
           <App />
          </CartProvider>
      </BrowserRouter>

  </StrictMode>
)
