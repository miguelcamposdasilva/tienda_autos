import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <header className="contenedor">
      <h1>Automarket</h1>
      <nav>
        <Link to="/" end>Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/registro">Registrarse</Link>
        <Link to="/login">Ingresar</Link>
        <Link to="/carrito" className="cart-link">
          Carrito {count > 0 && <span className="badge">{count}</span>}
        </Link>
        <Link to="/cotizar">Cotizar</Link>
      </nav>
    </header>
  );
}
