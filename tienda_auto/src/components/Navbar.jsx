// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <header className="contenedor">
      <h1>Automarket</h1>
      <nav>
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/catalogo">Catálogo</NavLink>
        <NavLink to="/registro">Registrarse</NavLink>
        <NavLink to="/login">Ingresar</NavLink>
        <NavLink to="/carrito" className="cart-link">
          Carrito {count > 0 && <span className="badge">{count}</span>}
        </NavLink>
        <NavLink to="/cotizar">Cotizar</NavLink>
      </nav>
    </header>
  );
}
