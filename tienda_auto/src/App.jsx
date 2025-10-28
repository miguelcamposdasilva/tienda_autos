import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import  './styles/styles.css'
import Home from './pages/Home' 
import Cotizar from './pages/Cotizar.JSX'
import Navbar from './components/Navbar'
import Carrito from './pages/Carrito'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Catalogo from './pages/Catalogo'

function App() {
  const [count, setCount] = useState(0)

  return (<>
  <Navbar/>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cotizar" element={<Cotizar />} />
      <Route path="/carrito" element={<Carrito/>} />
      <Route path="/registro" element={<Registro/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/catalogo" element={<Catalogo/>} />
    </Routes>

  </>
  )
}

export default App
