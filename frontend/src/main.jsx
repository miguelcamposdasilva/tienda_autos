// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/styles.css' // Asegúrate de importar tus estilos aquí o en App

// Importar los Proveedores de Contexto
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // <--- IMPORTANTE

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* El orden importa: Los providers deben envolver a App */}
      <AuthProvider>
        <CartProvider>
           <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)