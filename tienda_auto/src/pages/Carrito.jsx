// src/pages/Carrito.jsx
import { useMemo } from 'react';
import { useCart } from '../context/CartContext';

export default function Carrito() {
  const { items, inc, dec, remove, clear } = useCart();

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const total = subtotal; // si luego quieres descuento por sesión, lo aplicamos acá

  return (
    <div>
      <header className="contenedor">
        <h1>Carrito de compras</h1>
      </header>

      <main className="contenedor">
        <section aria-labelledby="carrito-titulo">
          <h2 id="carrito-titulo">Tus productos</h2>

          {items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(it => (
                      <tr key={it.id} style={{ borderBottom: '1px solid #2b2a2a' }}>
                        <td>{it.name}</td>
                        <td>${it.price}</td>
                        <td>
                          <button className="btn" style={{ padding:'4px 10px', marginRight:6 }} onClick={() => dec(it.id)}>-</button>
                          {it.qty}
                          <button className="btn" style={{ padding:'4px 10px', marginLeft:6 }} onClick={() => inc(it.id)}>+</button>
                        </td>
                        <td>${it.price * it.qty}</td>
                        <td>
                          <button className="btn" style={{ background:'#444' }} onClick={() => remove(it.id)}>Quitar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ textAlign:'right', fontWeight:700 }}>Total</td>
                      <td style={{ fontWeight:700 }}>${total}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:12 }}>
                <button className="btn" onClick={clear}>Vaciar carrito</button>
                <button className="btn">Ir a pagar (demo)</button>
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

// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Carrito - AutoMarket</title>
//   <link rel="stylesheet" href="../css/styles.css" />
//   <script src="../js/app.js" defer></script>

//   <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
//   <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
//   <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
//   <link rel="manifest" href="../images/site.webmanifest">
  
// </head>


