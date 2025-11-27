// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto de Auth

export default function Navbar() {
  const { items } = useCart();
  const { user, logout, isAdmin } = useAuth(); // Obtenemos datos del usuario
  const navigate = useNavigate();

  const count = items.reduce((s, it) => s + it.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Al salir, nos manda al login
  };

  return (
    <header className="contenedor">
      <h1>Automarket</h1>
      <nav>
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/catalogo">Catálogo</NavLink>

        {/* LÓGICA CONDICIONAL: ¿Está logueado? */}
        {user ? (
          <>
            {/* Si es ADMIN, mostramos el botón especial */}
            {isAdmin && (
              <NavLink 
                to="/admin" 
                style={{ 
                  backgroundColor: '#e63946', 
                  color: 'white', 
                  padding: '5px 10px', 
                  borderRadius: '4px' 
                }}
              >
                Panel Admin
              </NavLink>
            )}
            
            {/* Botón de Salir (Visible para cualquier usuario logueado) */}
            <button 
              onClick={handleLogout} 
              className="btn" 
              style={{ 
                marginLeft: '10px', 
                backgroundColor: '#333', 
                fontSize: '0.9rem',
                padding: '5px 10px'
              }}
            >
              Salir ({user.nombre})
            </button>
          </>
        ) : (
          /* Si NO está logueado, mostramos Registro e Ingreso */
          <>
            <NavLink to="/registro">Registrarse</NavLink>
            <NavLink to="/login">Ingresar</NavLink>
          </>
        )}

        <NavLink to="/carrito" className="cart-link">
          Carrito {count > 0 && <span className="badge">{count}</span>}
        </NavLink>
        <NavLink to="/cotizar">Cotizar</NavLink>
      </nav>
    </header>
  );
}