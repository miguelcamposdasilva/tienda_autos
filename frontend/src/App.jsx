import ReactDOM from 'react-dom/client'
import { Routes, Route } from 'react-router-dom'
import './styles/styles.css'

// Páginas
import Home from './pages/Home'
import Cotizar from './pages/Cotizar'
import Navbar from './components/Navbar'
import Carrito from './pages/Carrito'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Catalogo from './pages/Catalogo'
import AdminPanel from './pages/AdminPanel' // Importar nuevo componente

// Seguridad
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/cotizar" element={<Cotizar />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />

        {/* Rutas Privadas (SOLO ADMIN) */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
           <Route path="/admin" element={<AdminPanel />} />
        </Route>

      </Routes>
    </>
  )
}

export default App