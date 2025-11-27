// src/pages/Carrito.jsx
import { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
// Importamos íconos para mejorar la UI
import { FaTrash, FaShoppingCart, FaCreditCard, FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';

export default function Carrito() {
  const { items, inc, dec, remove, clear } = useCart();

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const total = subtotal; 

  // Función helper para formatear dinero con puntos
  const formatPrice = (amount) => {
    return amount.toLocaleString('es-CL');
  };

  return (
    <div>
      <main className="contenedor">
        
        {/* Título consistente con el resto de la web */}
        <div style={{ marginBottom: '20px' }}>
             <h2 id="carrito-titulo" style={{ 
                borderBottom: '2px solid #e63946', 
                display: 'inline-block', 
                paddingBottom: 5,
                marginBottom: 20,
                color: '#fff'
              }}>
              <FaShoppingCart style={{ marginRight: 10 }} />
              Tu Carrito de Compras
            </h2>
        </div>

        <section aria-labelledby="carrito-titulo">
          {items.length === 0 ? (
            /* --- ESTADO VACÍO (Estilo AuthCard) --- */
            <div className="auth-card" style={{ maxWidth: '600px', margin: '40px auto', padding: '50px' }}>
               <FaShoppingCart style={{ fontSize: '4rem', color: '#444', marginBottom: '20px' }} />
               <h3>Tu carrito está vacío.</h3>
               <p style={{ color: '#888', marginBottom: '30px' }}>Parece que aún no has agregado vehículos.</p>
               <Link to="/catalogo" className="btn-submit" style={{ display: 'inline-block', width: 'auto', padding: '10px 30px', textDecoration: 'none' }}>
                  Ir al Catálogo
               </Link>
            </div>
          ) : (
            <>
              {/* --- TABLA CON ESTILO DARK (Reutilizando clases de admin) --- */}
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unit.</th>
                      <th style={{ textAlign: 'center' }}>Cantidad</th>
                      <th>Subtotal</th>
                      <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(it => (
                      <tr key={it.id}>
                        <td style={{ fontWeight: 'bold' }}>{it.name}</td>
                        <td>${formatPrice(it.price)}</td>
                        
                        {/* Controles de Cantidad */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                             <button 
                                className="action-btn" 
                                style={{ background: '#444', color: '#fff' }} 
                                onClick={() => dec(it.id)}
                             >
                                <FaMinus size={10} />
                             </button>
                             
                             <span style={{ fontSize: '1.1rem', fontWeight: 'bold', width: '20px' }}>{it.qty}</span>
                             
                             <button 
                                className="action-btn" 
                                style={{ background: '#e63946', color: '#fff' }} 
                                onClick={() => inc(it.id)}
                             >
                                <FaPlus size={10} />
                             </button>
                          </div>
                        </td>

                        <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                            ${formatPrice(it.price * it.qty)}
                        </td>
                        
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="action-btn btn-delete" 
                            onClick={() => remove(it.id)}
                            title="Eliminar producto"
                          >
                            <FaTrash /> Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  
                  {/* Footer de la tabla con el Total */}
                  <tfoot style={{ background: '#222', borderTop: '2px solid #e63946' }}>
                    <tr>
                      <td colSpan="3" style={{ textAlign:'right', fontWeight:700, fontSize: '1.2rem', paddingRight: 20 }}>
                        TOTAL A PAGAR:
                      </td>
                      <td style={{ fontWeight:800, fontSize: '1.4rem', color: '#e63946' }}>
                        ${formatPrice(total)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* --- BOTONES DE ACCIÓN FINAL --- */}
              <div style={{ display:'flex', gap:15, justifyContent:'flex-end', marginTop: 30 }}>
                <button 
                    className="btn" 
                    style={{ background: '#444', display: 'flex', alignItems: 'center', gap: 8 }} 
                    onClick={clear}
                >
                    <FaTrash /> Vaciar carrito
                </button>
                
                <button 
                    className="btn-submit" 
                    style={{ width: 'auto', marginTop: 0, padding: '12px 30px', display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => alert("¡Funcionalidad de pago próximamente!")}
                >
                    <FaCreditCard /> Ir a Pagar
                </button>
              </div>
              
              <div style={{ marginTop: 20 }}>
                 <Link to="/catalogo" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#bbb' }}>
                    <FaArrowLeft /> Seguir comprando
                 </Link>
              </div>
            </>
          )}
        </section>
      </main>

      <footer>
        <div className="contenedor">
          <p>&copy; 2025 Automarket Spa - Todos los Derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
}